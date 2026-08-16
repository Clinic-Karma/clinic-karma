-- Complete the database boundary: sequence repair, transactional consultation
-- booking, and insurance relationship guards.

DO $migration$
DECLARE
  target record;
  sequence_name text;
  next_value bigint;
BEGIN
  FOR target IN
    SELECT * FROM (VALUES
      ('User', 'user_id'),
      ('Staff', 'Staff_ID'),
      ('Patient', 'patient_id'),
      ('Doctor', 'Doctor_ID'),
      ('Specialization', 'Specialization_ID'),
      ('Appointment', 'Appointment_ID'),
      ('Catalogue', 'Catalogue_ID'),
      ('Insurance', 'Insurance_ID'),
      ('Patient_Insurance', 'Patient_Insurance_ID'),
      ('Billing', 'Bill_ID'),
      ('Payment', 'Payment_ID'),
      ('Insurance_Claim', 'Insurance_Claim_ID'),
      ('refresh_tokens', 'id')
    ) AS sequence_target(table_name, column_name)
  LOOP
    sequence_name := pg_get_serial_sequence(
      format('%I', target.table_name),
      target.column_name
    );
    IF sequence_name IS NOT NULL THEN
      EXECUTE format(
        'SELECT COALESCE(MAX(%I), 0) + 1 FROM %I',
        target.column_name,
        target.table_name
      ) INTO next_value;
      PERFORM setval(sequence_name, next_value, false);
    END IF;
  END LOOP;
END
$migration$;

CREATE OR REPLACE FUNCTION book_consultation(
  patient_id_input integer,
  doctor_id_input integer,
  appointment_date_input date,
  start_time_input time,
  branch_name_input varchar,
  specialization_id_input integer,
  appointment_status_input varchar DEFAULT 'Scheduled'
)
RETURNS TABLE (
  appointment_id integer,
  bill_id integer,
  total_amount numeric(12,2),
  insured_amount numeric(12,2),
  patient_amount numeric(12,2),
  insurance_id integer
)
LANGUAGE plpgsql
AS $function$
DECLARE
  consultation_fee numeric(12,2);
  coverage_percentage numeric(5,2) := 0;
  selected_insurance_id integer;
  new_appointment_id integer;
  new_bill_id integer;
  calculated_insured_amount numeric(12,2);
  calculated_patient_amount numeric(12,2);
BEGIN
  IF appointment_status_input NOT IN ('Scheduled', 'Confirmed') THEN
    RAISE EXCEPTION 'New appointment status must be Scheduled or Confirmed';
  END IF;
  IF appointment_date_input < CURRENT_DATE THEN
    RAISE EXCEPTION 'Appointment date cannot be in the past';
  END IF;

  SELECT specialization."Consultation_Fee"
  INTO consultation_fee
  FROM "Doctor" doctor
  JOIN "Staff" staff ON staff."Staff_ID" = doctor."Staff_ID"
  JOIN "Doctor_Specialization" doctor_specialization
    ON doctor_specialization."Doctor_ID" = doctor."Doctor_ID"
  JOIN "Specialization" specialization
    ON specialization."Specialization_ID" = doctor_specialization."Specialization_ID"
  WHERE doctor."Doctor_ID" = doctor_id_input
    AND doctor_specialization."Specialization_ID" = specialization_id_input
    AND staff."Branch_Name" = branch_name_input
    AND staff."Is_Active" = true;

  IF consultation_fee IS NULL THEN
    RAISE EXCEPTION 'Doctor is not active for the selected branch and specialization';
  END IF;

  PERFORM 1 FROM "Patient" WHERE patient_id = patient_id_input FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Patient not found'; END IF;

  PERFORM pg_advisory_xact_lock(hashtextextended(
    patient_id_input || ':' || appointment_date_input, 0
  ));
  IF EXISTS (
    SELECT 1 FROM "Appointment"
    WHERE "Patient_ID" = patient_id_input
      AND "Appointment_Date" = appointment_date_input
      AND "Status" <> 'Cancelled'
  ) THEN
    RAISE EXCEPTION 'Patient already has an appointment on this date';
  END IF;

  SELECT patient_insurance."Insurance_ID", insurance."Coverage_Percentage"
  INTO selected_insurance_id, coverage_percentage
  FROM "Patient_Insurance" patient_insurance
  JOIN "Insurance" insurance
    ON insurance."Insurance_ID" = patient_insurance."Insurance_ID"
  WHERE patient_insurance."Patient_ID" = patient_id_input
    AND patient_insurance."Status" = 'Approved'
    AND insurance."Is_Active" = true
  ORDER BY patient_insurance."Patient_Insurance_ID" DESC
  LIMIT 1;

  coverage_percentage := COALESCE(coverage_percentage, 0);
  calculated_insured_amount := ROUND(consultation_fee * coverage_percentage / 100, 2);
  calculated_patient_amount := consultation_fee - calculated_insured_amount;

  INSERT INTO "Appointment" (
    "Patient_ID", "Appointment_Date", "Status", "Type", "Branch_Name"
  ) VALUES (
    patient_id_input, appointment_date_input, appointment_status_input,
    'Consultation', branch_name_input
  ) RETURNING "Appointment_ID" INTO new_appointment_id;

  INSERT INTO "Doctor_Appointment" (
    "Appointment_ID", "Doctor_ID", "Start_Time", "Is_Emergency", "Specialization_ID"
  ) VALUES (
    new_appointment_id, doctor_id_input, start_time_input, false, specialization_id_input
  );

  INSERT INTO "Billing" (
    "Appointment_ID", "Total_Amount", "Insured_Amount", "Patient_Amount",
    "Due_Date", "Insurance_ID", "Status"
  ) VALUES (
    new_appointment_id, consultation_fee, calculated_insured_amount,
    calculated_patient_amount, appointment_date_input + 30, selected_insurance_id,
    CASE WHEN calculated_patient_amount = 0 THEN 'Paid' ELSE 'Pending' END
  ) RETURNING "Bill_ID" INTO new_bill_id;

  RETURN QUERY SELECT
    new_appointment_id,
    new_bill_id,
    consultation_fee,
    calculated_insured_amount,
    calculated_patient_amount,
    selected_insurance_id;
END
$function$;

CREATE OR REPLACE FUNCTION validate_billing_insurance()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NEW."Insurance_ID" IS NOT NULL AND NOT EXISTS (
    SELECT 1
    FROM "Appointment" appointment
    JOIN "Patient_Insurance" patient_insurance
      ON patient_insurance."Patient_ID" = appointment."Patient_ID"
     AND patient_insurance."Insurance_ID" = NEW."Insurance_ID"
     AND patient_insurance."Status" = 'Approved'
    JOIN "Insurance" insurance
      ON insurance."Insurance_ID" = patient_insurance."Insurance_ID"
     AND insurance."Is_Active" = true
    WHERE appointment."Appointment_ID" = NEW."Appointment_ID"
  ) THEN
    RAISE EXCEPTION 'Billing insurance must be approved for the appointment patient';
  END IF;
  RETURN NEW;
END
$function$;

DROP TRIGGER IF EXISTS billing_insurance_validation_trigger ON "Billing";
CREATE TRIGGER billing_insurance_validation_trigger
BEFORE INSERT OR UPDATE OF "Appointment_ID", "Insurance_ID" ON "Billing"
FOR EACH ROW EXECUTE FUNCTION validate_billing_insurance();

CREATE OR REPLACE FUNCTION validate_insurance_claim_relationship()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM "Billing" billing
    JOIN "Appointment" appointment ON appointment."Appointment_ID" = billing."Appointment_ID"
    JOIN "Patient_Insurance" patient_insurance
      ON patient_insurance."Patient_Insurance_ID" = NEW."Patient_Insurance_ID"
     AND patient_insurance."Patient_ID" = appointment."Patient_ID"
     AND patient_insurance."Insurance_ID" = NEW."Insurance_ID"
     AND patient_insurance."Status" = 'Approved'
    WHERE billing."Bill_ID" = NEW."Bill_ID"
  ) THEN
    RAISE EXCEPTION 'Insurance claim does not match an approved patient policy for this bill';
  END IF;
  RETURN NEW;
END
$function$;

DROP TRIGGER IF EXISTS insurance_claim_relationship_trigger ON "Insurance_Claim";
CREATE TRIGGER insurance_claim_relationship_trigger
BEFORE INSERT OR UPDATE ON "Insurance_Claim"
FOR EACH ROW EXECUTE FUNCTION validate_insurance_claim_relationship();
