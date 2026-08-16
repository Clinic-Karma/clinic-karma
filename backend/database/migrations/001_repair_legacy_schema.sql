-- Data-preserving repair of the original Clinic Karma schema.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Disable the legacy audit triggers before repairing rows. Their old function
-- targeted columns that never existed in audit_log.
DROP TRIGGER IF EXISTS patient_audit_trigger ON "Patient";
DROP TRIGGER IF EXISTS user_audit_trigger ON "User";
DROP TRIGGER IF EXISTS staff_audit_trigger ON "Staff";
DROP FUNCTION IF EXISTS log_audit_changes();
DROP VIEW IF EXISTS appointment_details;
DROP VIEW IF EXISTS billing_summary;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS email varchar(254);
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE "User" ALTER COLUMN name TYPE varchar(100);
ALTER TABLE "User" ALTER COLUMN username TYPE varchar(50);
ALTER TABLE "User" ALTER COLUMN user_type TYPE varchar(30);
ALTER TABLE "User" ALTER COLUMN contact_number TYPE varchar(20);
ALTER TABLE "User" ALTER COLUMN nic TYPE varchar(20);
UPDATE "User" SET user_type = 'lab-coordinator' WHERE user_type = 'lab-assistant';
UPDATE "User" SET name = username WHERE name IS NULL OR btrim(name) = '';
ALTER TABLE "User" ALTER COLUMN name SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN username SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN password_hash SET NOT NULL;
ALTER TABLE "User" ALTER COLUMN user_type SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS user_username_unique_ci ON "User" (lower(username));
CREATE UNIQUE INDEX IF NOT EXISTS user_nic_unique ON "User" (nic) WHERE nic IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS user_email_unique_ci ON "User" (lower(email)) WHERE email IS NOT NULL;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'user_role_check') THEN
    ALTER TABLE "User" ADD CONSTRAINT user_role_check CHECK (
      user_type IN (
        'patient', 'doctor', 'receptionist', 'lab-coordinator',
        'branch-manager', 'top-manager'
      )
    );
  END IF;
END
$migration$;

ALTER TABLE "Branch" ADD COLUMN IF NOT EXISTS "Is_Active" boolean NOT NULL DEFAULT true;
ALTER TABLE "Branch" ADD COLUMN IF NOT EXISTS "Created_At" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Branch" ADD COLUMN IF NOT EXISTS "Updated_At" timestamptz NOT NULL DEFAULT now();
UPDATE "Branch" SET "Address" = 'Address not recorded' WHERE "Address" IS NULL OR btrim("Address") = '';
ALTER TABLE "Branch" ALTER COLUMN "Address" SET NOT NULL;

ALTER TABLE "Staff" ADD COLUMN IF NOT EXISTS "Is_Active" boolean NOT NULL DEFAULT true;
ALTER TABLE "Staff" ADD COLUMN IF NOT EXISTS "Created_At" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Staff" ADD COLUMN IF NOT EXISTS "Updated_At" timestamptz NOT NULL DEFAULT now();
UPDATE "Staff" SET "Salary" = 0 WHERE "Salary" IS NULL OR "Salary" < 0;
ALTER TABLE "Staff" ALTER COLUMN "Salary" SET DEFAULT 0;
ALTER TABLE "Staff" ALTER COLUMN "Salary" SET NOT NULL;

-- Keep the oldest staff profile when the legacy schema created duplicates.
-- Doctor references are moved before redundant, unreferenced profiles are removed.
UPDATE "Doctor" doctor
SET "Staff_ID" = canonical.canonical_staff_id
FROM (
  SELECT duplicate."Staff_ID" AS duplicate_staff_id,
         MIN(duplicate."Staff_ID") OVER (PARTITION BY duplicate."User_ID") AS canonical_staff_id
  FROM "Staff" duplicate
) canonical
WHERE doctor."Staff_ID" = canonical.duplicate_staff_id
  AND canonical.duplicate_staff_id <> canonical.canonical_staff_id
  AND NOT EXISTS (
    SELECT 1 FROM "Doctor" existing
    WHERE existing."Staff_ID" = canonical.canonical_staff_id
  );

DELETE FROM "Staff" duplicate
USING "Staff" canonical
WHERE duplicate."User_ID" = canonical."User_ID"
  AND duplicate."Staff_ID" > canonical."Staff_ID"
  AND NOT EXISTS (
    SELECT 1 FROM "Doctor" doctor WHERE doctor."Staff_ID" = duplicate."Staff_ID"
  );

-- Restore required profiles for login identities that were inserted only into User.
INSERT INTO "Patient" (user_id)
SELECT user_account.user_id
FROM "User" user_account
LEFT JOIN "Patient" patient ON patient.user_id = user_account.user_id
WHERE user_account.user_type = 'patient' AND patient.patient_id IS NULL;

INSERT INTO "Staff" ("User_ID", "Branch_Name", "Salary")
SELECT user_account.user_id,
       CASE WHEN user_account.user_type = 'top-manager' THEN NULL
            ELSE (SELECT "Branch_Name" FROM "Branch" ORDER BY "Branch_Name" LIMIT 1)
       END,
       0
FROM "User" user_account
LEFT JOIN "Staff" staff ON staff."User_ID" = user_account.user_id
WHERE user_account.user_type <> 'patient' AND staff."Staff_ID" IS NULL;

INSERT INTO "Doctor" ("Staff_ID")
SELECT staff."Staff_ID"
FROM "Staff" staff
JOIN "User" user_account ON user_account.user_id = staff."User_ID"
LEFT JOIN "Doctor" doctor ON doctor."Staff_ID" = staff."Staff_ID"
WHERE user_account.user_type = 'doctor' AND doctor."Doctor_ID" IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS staff_user_unique ON "Staff" ("User_ID");

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'staff_salary_check') THEN
    ALTER TABLE "Staff" ADD CONSTRAINT staff_salary_check CHECK ("Salary" >= 0);
  END IF;
END
$migration$;

ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Patient" ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Patient" ALTER COLUMN gender TYPE varchar(30);
ALTER TABLE "Patient" ALTER COLUMN emergency_contact TYPE varchar(20);
CREATE UNIQUE INDEX IF NOT EXISTS patient_user_unique ON "Patient" (user_id);

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'patient_dob_check') THEN
    ALTER TABLE "Patient" ADD CONSTRAINT patient_dob_check
      CHECK (date_of_birth IS NULL OR date_of_birth <= CURRENT_DATE);
  END IF;
END
$migration$;

ALTER TABLE "Doctor" ALTER COLUMN "Staff_ID" SET NOT NULL;
ALTER TABLE "Specialization" ALTER COLUMN "Specialization_Name" TYPE varchar(100);
UPDATE "Specialization" SET "Consultation_Fee" = 0
WHERE "Consultation_Fee" IS NULL OR "Consultation_Fee" < 0;
ALTER TABLE "Specialization" ALTER COLUMN "Specialization_Name" SET NOT NULL;
ALTER TABLE "Specialization" ALTER COLUMN "Consultation_Fee" SET DEFAULT 0;
ALTER TABLE "Specialization" ALTER COLUMN "Consultation_Fee" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS specialization_name_unique_ci
  ON "Specialization" (lower("Specialization_Name"));

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'specialization_fee_check') THEN
    ALTER TABLE "Specialization" ADD CONSTRAINT specialization_fee_check
      CHECK ("Consultation_Fee" >= 0);
  END IF;
END
$migration$;

ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "Created_At" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Appointment" ADD COLUMN IF NOT EXISTS "Updated_At" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Appointment" ALTER COLUMN "Status" TYPE varchar(20);
ALTER TABLE "Appointment" ALTER COLUMN "Type" TYPE varchar(20);
UPDATE "Appointment" SET "Status" = 'Confirmed' WHERE lower("Status") IN ('confimed', 'confirmed');
UPDATE "Appointment" SET "Status" = 'Scheduled'
WHERE "Status" IS NULL OR "Status" NOT IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled');
UPDATE "Appointment" appointment
SET "Type" = CASE
  WHEN EXISTS (
    SELECT 1 FROM "Doctor_Appointment" doctor_appointment
    WHERE doctor_appointment."Appointment_ID" = appointment."Appointment_ID"
  ) THEN 'Consultation'
  ELSE 'Laboratory'
END;
UPDATE "Appointment" SET "Appointment_Date" = CURRENT_DATE WHERE "Appointment_Date" IS NULL;
ALTER TABLE "Appointment" ALTER COLUMN "Appointment_Date" SET NOT NULL;
ALTER TABLE "Appointment" ALTER COLUMN "Status" SET DEFAULT 'Scheduled';
ALTER TABLE "Appointment" ALTER COLUMN "Status" SET NOT NULL;
ALTER TABLE "Appointment" ALTER COLUMN "Type" SET NOT NULL;
ALTER TABLE "Appointment" ALTER COLUMN "Branch_Name" SET NOT NULL;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'appointment_status_check') THEN
    ALTER TABLE "Appointment" ADD CONSTRAINT appointment_status_check
      CHECK ("Status" IN ('Scheduled', 'Confirmed', 'Completed', 'Cancelled'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'appointment_type_check') THEN
    ALTER TABLE "Appointment" ADD CONSTRAINT appointment_type_check
      CHECK ("Type" IN ('Consultation', 'Laboratory'));
  END IF;
END
$migration$;

UPDATE "Doctor_Appointment" SET "Is_Emergency" = false WHERE "Is_Emergency" IS NULL;
ALTER TABLE "Doctor_Appointment" ALTER COLUMN "Doctor_ID" SET NOT NULL;
ALTER TABLE "Doctor_Appointment" ALTER COLUMN "Start_Time" SET NOT NULL;
ALTER TABLE "Doctor_Appointment" ALTER COLUMN "Is_Emergency" SET DEFAULT false;
ALTER TABLE "Doctor_Appointment" ALTER COLUMN "Is_Emergency" SET NOT NULL;
ALTER TABLE "Doctor_Appointment" ALTER COLUMN "Specialization_ID" SET NOT NULL;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'doctor_appointment_specialization_fk') THEN
    ALTER TABLE "Doctor_Appointment"
      ADD CONSTRAINT doctor_appointment_specialization_fk
      FOREIGN KEY ("Doctor_ID", "Specialization_ID")
      REFERENCES "Doctor_Specialization" ("Doctor_ID", "Specialization_ID")
      ON DELETE RESTRICT;
  END IF;
END
$migration$;

ALTER TABLE "Catalogue" ADD COLUMN IF NOT EXISTS "Is_Active" boolean NOT NULL DEFAULT true;
UPDATE "Catalogue" SET "Treatment_name" = 'Catalogue item ' || "Catalogue_ID"
WHERE "Treatment_name" IS NULL OR btrim("Treatment_name") = '';
UPDATE "Catalogue" SET "Price" = 0 WHERE "Price" IS NULL OR "Price" < 0;
ALTER TABLE "Catalogue" ALTER COLUMN "Treatment_name" SET NOT NULL;
ALTER TABLE "Catalogue" ALTER COLUMN "Price" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS catalogue_treatment_name_unique_ci
  ON "Catalogue" (lower("Treatment_name"));

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'catalogue_price_check') THEN
    ALTER TABLE "Catalogue" ADD CONSTRAINT catalogue_price_check CHECK ("Price" >= 0);
  END IF;
END
$migration$;

ALTER TABLE "Treatment_Appointment" ALTER COLUMN "Report_Links" TYPE text;
ALTER TABLE "Treatment_Appointment" ADD COLUMN IF NOT EXISTS "Uploaded_At" timestamptz;

ALTER TABLE "Insurance" ADD COLUMN IF NOT EXISTS "Is_Active" boolean NOT NULL DEFAULT true;
ALTER TABLE "Insurance" ADD COLUMN IF NOT EXISTS "Created_At" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Insurance" ADD COLUMN IF NOT EXISTS "Updated_At" timestamptz NOT NULL DEFAULT now();
UPDATE "Insurance" SET "Provider_Name" = 'Insurance provider ' || "Insurance_ID"
WHERE "Provider_Name" IS NULL OR btrim("Provider_Name") = '';
UPDATE "Insurance" SET "Coverage_Percentage" = LEAST(GREATEST(COALESCE("Coverage_Percentage", 0), 0), 100);
UPDATE "Insurance" SET "Type" = 'General' WHERE "Type" IS NULL OR btrim("Type") = '';
ALTER TABLE "Insurance" ALTER COLUMN "Provider_Name" SET NOT NULL;
ALTER TABLE "Insurance" ALTER COLUMN "Coverage_Percentage" SET NOT NULL;
ALTER TABLE "Insurance" ALTER COLUMN "Type" TYPE varchar(30);
ALTER TABLE "Insurance" ALTER COLUMN "Type" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS insurance_provider_name_unique_ci
  ON "Insurance" (lower("Provider_Name"));

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'insurance_coverage_check') THEN
    ALTER TABLE "Insurance" ADD CONSTRAINT insurance_coverage_check
      CHECK ("Coverage_Percentage" BETWEEN 0 AND 100);
  END IF;
END
$migration$;

ALTER TABLE "Patient_Insurance"
  ADD COLUMN IF NOT EXISTS "Patient_Insurance_ID" integer GENERATED BY DEFAULT AS IDENTITY;
ALTER TABLE "Patient_Insurance" ADD COLUMN IF NOT EXISTS "Created_At" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Patient_Insurance" ADD COLUMN IF NOT EXISTS "Updated_At" timestamptz NOT NULL DEFAULT now();
UPDATE "Patient_Insurance" SET "Status" = 'Approved' WHERE lower("Status") = 'active';
UPDATE "Patient_Insurance" SET "Status" = 'Pending'
WHERE "Status" IS NULL OR lower("Status") IN ('waiting', 'pending');
UPDATE "Patient_Insurance" SET "Status" = initcap(lower("Status"));
UPDATE "Patient_Insurance" SET "Policy_Number" = 'LEGACY-' || "Patient_ID" || '-' || "Insurance_ID"
WHERE "Policy_Number" IS NULL OR btrim("Policy_Number") = '';
ALTER TABLE "Patient_Insurance" ALTER COLUMN "Patient_Insurance_ID" SET NOT NULL;
ALTER TABLE "Patient_Insurance" ALTER COLUMN "Policy_Number" TYPE varchar(50);
ALTER TABLE "Patient_Insurance" ALTER COLUMN "Policy_Number" SET NOT NULL;
ALTER TABLE "Patient_Insurance" ALTER COLUMN "Status" TYPE varchar(20);
ALTER TABLE "Patient_Insurance" ALTER COLUMN "Status" SET DEFAULT 'Pending';
ALTER TABLE "Patient_Insurance" ALTER COLUMN "Status" SET NOT NULL;
DO $migration$
DECLARE
  primary_key_name text;
  primary_key_definition text;
BEGIN
  SELECT constraint_record.conname, pg_get_constraintdef(constraint_record.oid)
  INTO primary_key_name, primary_key_definition
  FROM pg_constraint constraint_record
  WHERE constraint_record.conrelid = '"Patient_Insurance"'::regclass
    AND constraint_record.contype = 'p';

  IF primary_key_name IS NOT NULL
     AND primary_key_definition NOT LIKE '%"Patient_Insurance_ID"%' THEN
    EXECUTE format('ALTER TABLE "Patient_Insurance" DROP CONSTRAINT %I', primary_key_name);
    primary_key_name := NULL;
  END IF;

  IF primary_key_name IS NULL THEN
    ALTER TABLE "Patient_Insurance"
      ADD CONSTRAINT patient_insurance_pkey PRIMARY KEY ("Patient_Insurance_ID");
  END IF;
END
$migration$;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'patient_insurance_status_check') THEN
    ALTER TABLE "Patient_Insurance" ADD CONSTRAINT patient_insurance_status_check
      CHECK ("Status" IN ('Pending', 'Approved', 'Rejected'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'patient_insurance_policy_unique') THEN
    ALTER TABLE "Patient_Insurance" ADD CONSTRAINT patient_insurance_policy_unique
      UNIQUE ("Patient_ID", "Insurance_ID", "Policy_Number");
  END IF;
END
$migration$;

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Billing'
      AND column_name = 'Insurance_ID' AND data_type = 'date'
  ) THEN
    IF EXISTS (SELECT 1 FROM "Billing" WHERE "Insurance_ID" IS NOT NULL) THEN
      RAISE EXCEPTION 'Billing.Insurance_ID contains legacy date values; manual mapping is required';
    END IF;
    ALTER TABLE "Billing" ALTER COLUMN "Insurance_ID" DROP DEFAULT;
    ALTER TABLE "Billing" ALTER COLUMN "Insurance_ID" TYPE integer USING NULL::integer;
  END IF;
END
$migration$;

ALTER TABLE "Billing" ALTER COLUMN "Total_Amount" TYPE numeric(12,2) USING COALESCE("Total_Amount", 0)::numeric(12,2);
ALTER TABLE "Billing" ALTER COLUMN "Insured_Amount" TYPE numeric(12,2) USING COALESCE("Insured_Amount", 0)::numeric(12,2);
ALTER TABLE "Billing" ALTER COLUMN "Patient_Amount" TYPE numeric(12,2) USING COALESCE("Patient_Amount", 0)::numeric(12,2);
ALTER TABLE "Billing" ADD COLUMN IF NOT EXISTS "Status" varchar(20) DEFAULT 'Pending';
ALTER TABLE "Billing" ADD COLUMN IF NOT EXISTS "Created_At" timestamptz NOT NULL DEFAULT now();
ALTER TABLE "Billing" ADD COLUMN IF NOT EXISTS "Updated_At" timestamptz NOT NULL DEFAULT now();
UPDATE "Billing" SET "Total_Amount" = GREATEST(COALESCE("Total_Amount", 0), 0);
UPDATE "Billing" SET "Insured_Amount" = LEAST(GREATEST(COALESCE("Insured_Amount", 0), 0), "Total_Amount");
UPDATE "Billing" SET "Patient_Amount" = "Total_Amount" - "Insured_Amount";
UPDATE "Billing" billing
SET "Due_Date" = appointment."Appointment_Date" + 30
FROM "Appointment" appointment
WHERE appointment."Appointment_ID" = billing."Appointment_ID" AND billing."Due_Date" IS NULL;
UPDATE "Billing" billing
SET "Insurance_ID" = (
  SELECT patient_insurance."Insurance_ID"
  FROM "Appointment" appointment
  JOIN "Patient_Insurance" patient_insurance
    ON patient_insurance."Patient_ID" = appointment."Patient_ID"
   AND patient_insurance."Status" = 'Approved'
  WHERE appointment."Appointment_ID" = billing."Appointment_ID"
  ORDER BY patient_insurance."Patient_Insurance_ID" DESC
  LIMIT 1
)
WHERE billing."Insurance_ID" IS NULL AND billing."Insured_Amount" > 0;
UPDATE "Billing" billing
SET "Status" = CASE
  WHEN billing."Patient_Amount" = 0 OR COALESCE((
    SELECT SUM(payment."Amount") FROM "Payment" payment WHERE payment."Bill_ID" = billing."Bill_ID"
  ), 0) >= billing."Patient_Amount" THEN 'Paid'
  WHEN COALESCE((
    SELECT SUM(payment."Amount") FROM "Payment" payment WHERE payment."Bill_ID" = billing."Bill_ID"
  ), 0) > 0 THEN 'Partial'
  ELSE 'Pending'
END;
ALTER TABLE "Billing" ALTER COLUMN "Total_Amount" SET DEFAULT 0;
ALTER TABLE "Billing" ALTER COLUMN "Insured_Amount" SET DEFAULT 0;
ALTER TABLE "Billing" ALTER COLUMN "Patient_Amount" SET DEFAULT 0;
ALTER TABLE "Billing" ALTER COLUMN "Status" SET DEFAULT 'Pending';
ALTER TABLE "Billing" ALTER COLUMN "Total_Amount" SET NOT NULL;
ALTER TABLE "Billing" ALTER COLUMN "Insured_Amount" SET NOT NULL;
ALTER TABLE "Billing" ALTER COLUMN "Patient_Amount" SET NOT NULL;
ALTER TABLE "Billing" ALTER COLUMN "Due_Date" SET NOT NULL;
ALTER TABLE "Billing" ALTER COLUMN "Status" SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS billing_appointment_unique ON "Billing" ("Appointment_ID");

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'billing_insurance_fk') THEN
    ALTER TABLE "Billing" ADD CONSTRAINT billing_insurance_fk
      FOREIGN KEY ("Insurance_ID") REFERENCES "Insurance"("Insurance_ID") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'billing_amounts_check') THEN
    ALTER TABLE "Billing" ADD CONSTRAINT billing_amounts_check CHECK (
      "Total_Amount" >= 0 AND "Insured_Amount" >= 0 AND "Patient_Amount" >= 0
      AND "Total_Amount" = "Insured_Amount" + "Patient_Amount"
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'billing_status_check') THEN
    ALTER TABLE "Billing" ADD CONSTRAINT billing_status_check
      CHECK ("Status" IN ('Pending', 'Partial', 'Paid'));
  END IF;
END
$migration$;

ALTER TABLE "Payment" ADD COLUMN IF NOT EXISTS "Reference" varchar(100);
DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'Payment'
      AND column_name = 'Date_Time' AND data_type = 'timestamp without time zone'
  ) THEN
    ALTER TABLE "Payment" ALTER COLUMN "Date_Time" TYPE timestamptz
      USING "Date_Time" AT TIME ZONE 'Asia/Colombo';
  END IF;
END
$migration$;
ALTER TABLE "Payment" ALTER COLUMN "Date_Time" SET DEFAULT now();
ALTER TABLE "Payment" ALTER COLUMN "Bill_ID" SET NOT NULL;
ALTER TABLE "Payment" ALTER COLUMN "Amount" SET NOT NULL;
ALTER TABLE "Payment" ALTER COLUMN "Date_Time" SET NOT NULL;
ALTER TABLE "Payment" ALTER COLUMN "Payment_Method" TYPE varchar(50);
ALTER TABLE "Payment" ALTER COLUMN "Payment_Method" SET NOT NULL;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payment_amount_check') THEN
    ALTER TABLE "Payment" ADD CONSTRAINT payment_amount_check CHECK ("Amount" > 0);
  END IF;
END
$migration$;

ALTER TABLE "Insurance_Claim" ADD COLUMN IF NOT EXISTS "Patient_Insurance_ID" integer;
ALTER TABLE "Insurance_Claim" ADD COLUMN IF NOT EXISTS "Decision_Date" date;
UPDATE "Insurance_Claim" claim
SET "Patient_Insurance_ID" = (
  SELECT patient_insurance."Patient_Insurance_ID"
  FROM "Billing" billing
  JOIN "Appointment" appointment ON appointment."Appointment_ID" = billing."Appointment_ID"
  JOIN "Patient_Insurance" patient_insurance
    ON patient_insurance."Patient_ID" = appointment."Patient_ID"
   AND patient_insurance."Insurance_ID" = claim."Insurance_ID"
  WHERE billing."Bill_ID" = claim."Bill_ID"
  ORDER BY patient_insurance."Patient_Insurance_ID" DESC
  LIMIT 1
)
WHERE claim."Patient_Insurance_ID" IS NULL;
UPDATE "Insurance_Claim" SET "Claim_Status" = 'Pending'
WHERE "Claim_Status" IS NULL OR "Claim_Status" NOT IN ('Pending', 'Approved', 'Rejected');
UPDATE "Insurance_Claim" SET "Submitted_Date" = CURRENT_DATE WHERE "Submitted_Date" IS NULL;
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Bill_ID" SET NOT NULL;
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Insurance_ID" SET NOT NULL;
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Patient_Insurance_ID" SET NOT NULL;
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Claim_Amount" SET NOT NULL;
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Claim_Status" TYPE varchar(20);
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Claim_Status" SET DEFAULT 'Pending';
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Claim_Status" SET NOT NULL;
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Submitted_Date" SET DEFAULT CURRENT_DATE;
ALTER TABLE "Insurance_Claim" ALTER COLUMN "Submitted_Date" SET NOT NULL;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'insurance_claim_patient_insurance_fk') THEN
    ALTER TABLE "Insurance_Claim" ADD CONSTRAINT insurance_claim_patient_insurance_fk
      FOREIGN KEY ("Patient_Insurance_ID")
      REFERENCES "Patient_Insurance"("Patient_Insurance_ID") ON DELETE RESTRICT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'insurance_claim_amount_check') THEN
    ALTER TABLE "Insurance_Claim" ADD CONSTRAINT insurance_claim_amount_check CHECK ("Claim_Amount" > 0);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'insurance_claim_status_check') THEN
    ALTER TABLE "Insurance_Claim" ADD CONSTRAINT insurance_claim_status_check
      CHECK ("Claim_Status" IN ('Pending', 'Approved', 'Rejected'));
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'insurance_claim_decision_check') THEN
    ALTER TABLE "Insurance_Claim" ADD CONSTRAINT insurance_claim_decision_check
      CHECK ("Decision_Date" IS NULL OR "Decision_Date" >= "Submitted_Date");
  END IF;
END
$migration$;

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'refresh_tokens' AND column_name = 'token'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'refresh_tokens' AND column_name = 'token_hash'
  ) THEN
    ALTER TABLE refresh_tokens RENAME COLUMN token TO token_hash;
  END IF;
END
$migration$;

DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'refresh_tokens'
      AND column_name = 'created_at' AND data_type = 'timestamp without time zone'
  ) THEN
    ALTER TABLE refresh_tokens ALTER COLUMN created_at TYPE timestamptz
      USING created_at AT TIME ZONE 'Asia/Colombo';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'refresh_tokens'
      AND column_name = 'expires_at' AND data_type = 'timestamp without time zone'
  ) THEN
    ALTER TABLE refresh_tokens ALTER COLUMN expires_at TYPE timestamptz
      USING expires_at AT TIME ZONE 'Asia/Colombo';
  END IF;
END
$migration$;
ALTER TABLE refresh_tokens ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE refresh_tokens ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE refresh_tokens ALTER COLUMN revoked SET DEFAULT false;
ALTER TABLE refresh_tokens ALTER COLUMN revoked SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS refresh_tokens_token_hash_unique ON refresh_tokens (token_hash);

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'refresh_token_expiry_check') THEN
    ALTER TABLE refresh_tokens ADD CONSTRAINT refresh_token_expiry_check CHECK (expires_at > created_at);
  END IF;
END
$migration$;

ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS changed_by_user_id integer;
DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'audit_log' AND column_name = 'changed_by'
  ) THEN
    UPDATE audit_log audit
    SET changed_by_user_id = audit.changed_by::integer
    WHERE audit.changed_by ~ '^[0-9]+$'
      AND EXISTS (
        SELECT 1 FROM "User" user_account
        WHERE user_account.user_id = audit.changed_by::integer
      );
  END IF;
END
$migration$;
UPDATE audit_log SET table_name = 'unknown' WHERE table_name IS NULL;
UPDATE audit_log SET record_id = 'unknown' WHERE record_id IS NULL;
UPDATE audit_log SET operation_type = 'UPDATE'
WHERE operation_type IS NULL OR operation_type NOT IN ('INSERT', 'UPDATE', 'DELETE');
ALTER TABLE audit_log ALTER COLUMN table_name SET NOT NULL;
ALTER TABLE audit_log ALTER COLUMN record_id SET NOT NULL;
ALTER TABLE audit_log ALTER COLUMN operation_type SET NOT NULL;
DO $migration$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'audit_log'
      AND column_name = 'changed_at' AND data_type = 'timestamp without time zone'
  ) THEN
    ALTER TABLE audit_log ALTER COLUMN changed_at TYPE timestamptz
      USING changed_at AT TIME ZONE 'Asia/Colombo';
  END IF;
END
$migration$;
ALTER TABLE audit_log ALTER COLUMN changed_at SET DEFAULT now();
ALTER TABLE audit_log ALTER COLUMN changed_at SET NOT NULL;

DO $migration$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'audit_log_changed_by_fk') THEN
    ALTER TABLE audit_log ADD CONSTRAINT audit_log_changed_by_fk
      FOREIGN KEY (changed_by_user_id) REFERENCES "User"(user_id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'audit_log_operation_check') THEN
    ALTER TABLE audit_log ADD CONSTRAINT audit_log_operation_check
      CHECK (operation_type IN ('INSERT', 'UPDATE', 'DELETE'));
  END IF;
END
$migration$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END
$function$;

CREATE OR REPLACE FUNCTION set_quoted_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  NEW."Updated_At" = now();
  RETURN NEW;
END
$function$;

DROP TRIGGER IF EXISTS user_updated_at_trigger ON "User";
CREATE TRIGGER user_updated_at_trigger BEFORE UPDATE ON "User"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS patient_updated_at_trigger ON "Patient";
CREATE TRIGGER patient_updated_at_trigger BEFORE UPDATE ON "Patient"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();
DROP TRIGGER IF EXISTS branch_updated_at_trigger ON "Branch";
CREATE TRIGGER branch_updated_at_trigger BEFORE UPDATE ON "Branch"
FOR EACH ROW EXECUTE FUNCTION set_quoted_updated_at();
DROP TRIGGER IF EXISTS staff_updated_at_trigger ON "Staff";
CREATE TRIGGER staff_updated_at_trigger BEFORE UPDATE ON "Staff"
FOR EACH ROW EXECUTE FUNCTION set_quoted_updated_at();
DROP TRIGGER IF EXISTS appointment_updated_at_trigger ON "Appointment";
CREATE TRIGGER appointment_updated_at_trigger BEFORE UPDATE ON "Appointment"
FOR EACH ROW EXECUTE FUNCTION set_quoted_updated_at();
DROP TRIGGER IF EXISTS billing_updated_at_trigger ON "Billing";
CREATE TRIGGER billing_updated_at_trigger BEFORE UPDATE ON "Billing"
FOR EACH ROW EXECUTE FUNCTION set_quoted_updated_at();
DROP TRIGGER IF EXISTS insurance_updated_at_trigger ON "Insurance";
CREATE TRIGGER insurance_updated_at_trigger BEFORE UPDATE ON "Insurance"
FOR EACH ROW EXECUTE FUNCTION set_quoted_updated_at();
DROP TRIGGER IF EXISTS patient_insurance_updated_at_trigger ON "Patient_Insurance";
CREATE TRIGGER patient_insurance_updated_at_trigger BEFORE UPDATE ON "Patient_Insurance"
FOR EACH ROW EXECUTE FUNCTION set_quoted_updated_at();

CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  actor_setting text;
  actor_id integer;
  old_values jsonb;
  new_values jsonb;
  entity_id text;
BEGIN
  actor_setting := current_setting('app.current_user_id', true);
  IF actor_setting ~ '^[0-9]+$' THEN actor_id := actor_setting::integer; END IF;

  IF TG_OP <> 'INSERT' THEN old_values := to_jsonb(OLD); END IF;
  IF TG_OP <> 'DELETE' THEN new_values := to_jsonb(NEW); END IF;
  entity_id := COALESCE(
    new_values->>'user_id', old_values->>'user_id',
    new_values->>'patient_id', old_values->>'patient_id',
    new_values->>'Staff_ID', old_values->>'Staff_ID',
    'unknown'
  );

  INSERT INTO audit_log (
    table_name, record_id, operation_type, changed_by_user_id,
    original_values, new_values
  ) VALUES (
    TG_TABLE_NAME, entity_id, TG_OP, actor_id, old_values, new_values
  );

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END
$function$;

CREATE TRIGGER patient_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON "Patient"
FOR EACH ROW EXECUTE FUNCTION log_audit_changes();
CREATE TRIGGER user_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON "User"
FOR EACH ROW EXECUTE FUNCTION log_audit_changes();
CREATE TRIGGER staff_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON "Staff"
FOR EACH ROW EXECUTE FUNCTION log_audit_changes();

CREATE OR REPLACE FUNCTION validate_payment_amount()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  patient_responsibility numeric(12,2);
  previously_paid numeric(12,2);
BEGIN
  IF NEW."Amount" <= 0 THEN RAISE EXCEPTION 'Payment amount must be positive'; END IF;

  SELECT "Patient_Amount" INTO patient_responsibility
  FROM "Billing" WHERE "Bill_ID" = NEW."Bill_ID" FOR UPDATE;
  IF patient_responsibility IS NULL THEN RAISE EXCEPTION 'Bill % not found', NEW."Bill_ID"; END IF;

  SELECT COALESCE(SUM("Amount"), 0) INTO previously_paid
  FROM "Payment"
  WHERE "Bill_ID" = NEW."Bill_ID"
    AND (TG_OP = 'INSERT' OR "Payment_ID" <> NEW."Payment_ID");

  IF previously_paid + NEW."Amount" > patient_responsibility THEN
    RAISE EXCEPTION 'Payment exceeds remaining patient balance';
  END IF;
  RETURN NEW;
END
$function$;

CREATE OR REPLACE FUNCTION update_bill_status_on_payment()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  target_bill_id integer;
  patient_responsibility numeric(12,2);
  total_paid numeric(12,2);
BEGIN
  target_bill_id := COALESCE(NEW."Bill_ID", OLD."Bill_ID");
  SELECT "Patient_Amount" INTO patient_responsibility FROM "Billing" WHERE "Bill_ID" = target_bill_id;
  SELECT COALESCE(SUM("Amount"), 0) INTO total_paid FROM "Payment" WHERE "Bill_ID" = target_bill_id;

  UPDATE "Billing"
  SET "Status" = CASE
    WHEN patient_responsibility = 0 OR total_paid >= patient_responsibility THEN 'Paid'
    WHEN total_paid > 0 THEN 'Partial'
    ELSE 'Pending'
  END
  WHERE "Bill_ID" = target_bill_id;

  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END
$function$;

DROP TRIGGER IF EXISTS payment_amount_validation_trigger ON "Payment";
CREATE TRIGGER payment_amount_validation_trigger BEFORE INSERT OR UPDATE ON "Payment"
FOR EACH ROW EXECUTE FUNCTION validate_payment_amount();
DROP TRIGGER IF EXISTS payment_bill_status_trigger ON "Payment";
CREATE TRIGGER payment_bill_status_trigger AFTER INSERT OR UPDATE OR DELETE ON "Payment"
FOR EACH ROW EXECUTE FUNCTION update_bill_status_on_payment();

CREATE OR REPLACE FUNCTION enforce_doctor_slot_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
DECLARE
  appointment_date date;
  booked_count integer;
BEGIN
  SELECT "Appointment_Date" INTO appointment_date
  FROM "Appointment" WHERE "Appointment_ID" = NEW."Appointment_ID";

  PERFORM pg_advisory_xact_lock(hashtextextended(
    NEW."Doctor_ID" || ':' || appointment_date || ':' || NEW."Start_Time", 0
  ));

  SELECT COUNT(*) INTO booked_count
  FROM "Doctor_Appointment" doctor_appointment
  JOIN "Appointment" appointment
    ON appointment."Appointment_ID" = doctor_appointment."Appointment_ID"
  WHERE doctor_appointment."Doctor_ID" = NEW."Doctor_ID"
    AND doctor_appointment."Start_Time" = NEW."Start_Time"
    AND appointment."Appointment_Date" = appointment_date
    AND appointment."Status" <> 'Cancelled'
    AND doctor_appointment."Appointment_ID" <> NEW."Appointment_ID";

  IF booked_count >= 5 THEN RAISE EXCEPTION 'Doctor time slot is full'; END IF;
  RETURN NEW;
END
$function$;

DROP TRIGGER IF EXISTS doctor_slot_capacity_trigger ON "Doctor_Appointment";
CREATE TRIGGER doctor_slot_capacity_trigger BEFORE INSERT OR UPDATE ON "Doctor_Appointment"
FOR EACH ROW EXECUTE FUNCTION enforce_doctor_slot_capacity();

CREATE INDEX IF NOT EXISTS appointment_patient_date_idx ON "Appointment" ("Patient_ID", "Appointment_Date");
CREATE INDEX IF NOT EXISTS appointment_branch_date_idx ON "Appointment" ("Branch_Name", "Appointment_Date");
CREATE INDEX IF NOT EXISTS doctor_appointment_slot_idx ON "Doctor_Appointment" ("Doctor_ID", "Start_Time");
CREATE INDEX IF NOT EXISTS payment_bill_date_idx ON "Payment" ("Bill_ID", "Date_Time");
CREATE INDEX IF NOT EXISTS refresh_tokens_user_idx ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS refresh_tokens_expiry_idx ON refresh_tokens (expires_at) WHERE revoked = false;
CREATE INDEX IF NOT EXISTS audit_log_record_idx ON audit_log (table_name, record_id, changed_at DESC);

CREATE OR REPLACE VIEW appointment_details AS
SELECT
  appointment."Appointment_ID",
  appointment."Appointment_Date",
  appointment."Status",
  appointment."Type",
  appointment."Branch_Name",
  patient_user.name AS patient_name,
  patient_user.username AS patient_username,
  doctor_user.name AS doctor_name,
  doctor_appointment."Start_Time",
  doctor_appointment."Is_Emergency",
  specialization."Specialization_Name"
FROM "Appointment" appointment
JOIN "Patient" patient ON patient.patient_id = appointment."Patient_ID"
JOIN "User" patient_user ON patient_user.user_id = patient.user_id
LEFT JOIN "Doctor_Appointment" doctor_appointment
  ON doctor_appointment."Appointment_ID" = appointment."Appointment_ID"
LEFT JOIN "Doctor" doctor ON doctor."Doctor_ID" = doctor_appointment."Doctor_ID"
LEFT JOIN "Staff" staff ON staff."Staff_ID" = doctor."Staff_ID"
LEFT JOIN "User" doctor_user ON doctor_user.user_id = staff."User_ID"
LEFT JOIN "Specialization" specialization
  ON specialization."Specialization_ID" = doctor_appointment."Specialization_ID";

CREATE OR REPLACE VIEW billing_summary AS
SELECT
  billing."Bill_ID",
  billing."Appointment_ID",
  billing."Total_Amount",
  billing."Insured_Amount",
  billing."Patient_Amount",
  billing."Status",
  billing."Due_Date",
  COALESCE(SUM(payment."Amount"), 0)::numeric(12,2) AS total_paid,
  GREATEST(billing."Patient_Amount" - COALESCE(SUM(payment."Amount"), 0), 0)::numeric(12,2) AS remaining_amount
FROM "Billing" billing
LEFT JOIN "Payment" payment ON payment."Bill_ID" = billing."Bill_ID"
GROUP BY billing."Bill_ID";
