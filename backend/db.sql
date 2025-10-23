
-- ===========================================
-- PostgreSQL Schema for MYER (Modern + Cascades)
-- ===========================================

-- USER table
CREATE TABLE "User" (
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name VARCHAR(100),
  nic VARCHAR(15),
  contact_number VARCHAR(10),
  address VARCHAR(255),
  username VARCHAR(50),
  password_hash VARCHAR(255),
  user_type VARCHAR(20)
);

-- BRANCH table
CREATE TABLE "Branch" (
  "Branch_Name" VARCHAR(50) PRIMARY KEY,
  "Contact_Number" VARCHAR(15),
  "Address" VARCHAR(255)
);

-- STAFF table
CREATE TABLE "Staff" (
  "Staff_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "User_ID" INT NOT NULL,
  "Branch_Name" VARCHAR(50),
  "Role" VARCHAR(20),
  "Salary" DECIMAL(10, 2),
  CONSTRAINT "FK_Staff_User_ID"
    FOREIGN KEY ("User_ID")
      REFERENCES "User"(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_Staff_Branch_Name"
    FOREIGN KEY ("Branch_Name")
      REFERENCES "Branch"("Branch_Name")
      ON DELETE SET NULL ON UPDATE CASCADE
);

-- DOCTOR table
CREATE TABLE "Doctor" (
  "Doctor_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Staff_ID" INT UNIQUE,
  CONSTRAINT "FK_Doctor_Staff_ID"
    FOREIGN KEY ("Staff_ID")
      REFERENCES "Staff"("Staff_ID")
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- SPECIALIZATION table
CREATE TABLE "Specialization" (
  "Specialization_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Specialization_Name" VARCHAR(50),
  "Consultation_Fee" DECIMAL(10, 2)
);

-- DOCTOR_SPECIALIZATION (Junction)
CREATE TABLE "Doctor_Specialization" (
  "Doctor_ID" INT,
  "Specialization_ID" INT,
  PRIMARY KEY ("Doctor_ID", "Specialization_ID"),
  CONSTRAINT "FK_Doctor_Specialization_Doctor_ID"
    FOREIGN KEY ("Doctor_ID")
      REFERENCES "Doctor"("Doctor_ID")
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_Doctor_Specialization_Specialization_ID"
    FOREIGN KEY ("Specialization_ID")
      REFERENCES "Specialization"("Specialization_ID")
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- PATIENT table
CREATE TABLE "Patient" (
  patient_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  date_of_birth DATE,
  gender VARCHAR(6),
  emergency_contact VARCHAR(15),
  CONSTRAINT "FK_Patient_User_ID"
    FOREIGN KEY (user_id)
      REFERENCES "User"(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- APPOINTMENT table
CREATE TABLE "Appointment" (
  "Appointment_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Patient_ID" INT NOT NULL,
  "Appointment_Date" DATE,
  "Status" VARCHAR(10),
  "Type" VARCHAR(10),
  "Branch_Name" VARCHAR (50) NOT NULL,
  CONSTRAINT "FK_Appointment_Branch_Name"
    FOREIGN KEY ("Branch_Name")
      REFERENCES "Branch"("Branch_Name")
      ON DELETE SET NULL ON UPDATE CASCADE
  CONSTRAINT "FK_Appointment_Patient_ID"
    FOREIGN KEY ("Patient_ID")
      REFERENCES "Patient"(patient_id)
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- CATALOGUE table
CREATE TABLE "Catalogue" (
  "Catalogue_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Treatment_name" VARCHAR(100),
  "Price" DECIMAL(10, 2)
);

-- TREATMENT_APPOINTMENT table
CREATE TABLE "Treatment_Appointment" (
  "Appointment_ID" INT PRIMARY KEY,
  "Catalogue_ID" INT,
  "Report_Links" VARCHAR(500),
  CONSTRAINT "FK_Treatment_Appointment_Appointment_ID"
    FOREIGN KEY ("Appointment_ID")
      REFERENCES "Appointment"("Appointment_ID")
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_Treatment_Appointment_Catalogue_ID"
    FOREIGN KEY ("Catalogue_ID")
      REFERENCES "Catalogue"("Catalogue_ID")
      ON DELETE SET NULL ON UPDATE CASCADE
);

-- DOCTOR_APPOINTMENT table
CREATE TABLE "Doctor_Appointment" (
  "Appointment_ID" INT PRIMARY KEY,
  "Doctor_ID" INT,
  "Start_Time" TIME,
  "Is_Emergency" BOOLEAN,
  "Diagnosis" TEXT,
  "Prescription" TEXT,
  "Additional_Notes" TEXT,
    "Specialization_ID" INT,
  CONSTRAINT "FK_Doctor_Specialization_Specialization_ID"
    FOREIGN KEY ("Specialization_ID")
      REFERENCES "Specialization"("Specialization_ID")
      ON DELETE CASCADE ON UPDATE CASCADE
  CONSTRAINT "FK_Doctor_Appointment_Appointment_ID"
    FOREIGN KEY ("Appointment_ID")
      REFERENCES "Appointment"("Appointment_ID")
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_Doctor_Appointment_Doctor_ID"
    FOREIGN KEY ("Doctor_ID")
      REFERENCES "Doctor"("Doctor_ID")
      ON DELETE SET NULL ON UPDATE CASCADE
);

-- BILLING table
CREATE TABLE "Billing" (
  "Bill_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Appointment_ID" INT NOT NULL,
  "Total_Amount" NUMERIC(10, 2) DEFAULT 0,
  "Insured_Amount" NUMERIC(10, 2) DEFAULT 0,
  "Patient_Amount" NUMERIC(10, 2) DEFAULT 0,
  "Due_Date" DATE,
  "Insurance_ID" INTEGER,
  CONSTRAINT "FK_Billing_Appointment_ID"
    FOREIGN KEY ("Appointment_ID")
      REFERENCES "Appointment"("Appointment_ID")
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- INSURANCE table
CREATE TABLE "Insurance" (
  "Insurance_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Provider_Name" VARCHAR(100),
  "Coverage_Percentage" DECIMAL(5, 2),
  "Type" VARCHAR(10)
);

-- PATIENT_INSURANCE (junction)
CREATE TABLE "Patient_Insurance" (
  "Patient_ID" INT,
  "Insurance_ID" INT,
  "Policy_Number" VARCHAR(10),
    "Status" VARCHAR(20) DEFAULT "Pending",
  PRIMARY KEY ("Patient_ID", "Insurance_ID"),
  CONSTRAINT "FK_Patient_Insurance_Patient_ID"
    FOREIGN KEY ("Patient_ID")
      REFERENCES "Patient"("Patient_ID")
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_Patient_Insurance_Insurance_ID"
    FOREIGN KEY ("Insurance_ID")
      REFERENCES "Insurance"("Insurance_ID")
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- INSURANCE_CLAIM table
CREATE TABLE "Insurance_Claim" (
  "Insurance_Claim_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Bill_ID" INT,
  "Insurance_ID" INT,
  "Claim_Amount" DECIMAL(10, 2),
  "Claim_Status" TEXT,
  "Submitted_Date" DATE,
  CONSTRAINT "FK_Insurance_Claim_Bill_ID"
    FOREIGN KEY ("Bill_ID")
      REFERENCES "Billing"("Bill_ID")
      ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_Insurance_Claim_Insurance_ID"
    FOREIGN KEY ("Insurance_ID")
      REFERENCES "Insurance"("Insurance_ID")
      ON DELETE CASCADE ON UPDATE CASCADE
);

-- PAYMENT table
CREATE TABLE "Payment" (
  "Payment_ID" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "Bill_ID" INT,
  "Amount" DECIMAL(10, 2),
  "Date_Time" TIMESTAMP,
  "Payment_Method" TEXT,
  CONSTRAINT "FK_Payment_Bill_ID"
    FOREIGN KEY ("Bill_ID")
      REFERENCES "Billing"("Bill_ID")
      ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE refersh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  jti UUID UNIQUE NOT NULL,
  token text NOT NULL,
  created_at TIMESTAMP DEFAULT 'now()',
  expired_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT 'false',
  CONSTRAINT "FK_refersh_tokens_User_ID"
    FOREIGN KEY (user_id)
      REFERENCES "User"(user_id)
      ON DELETE CASCADE ON UPDATE CASCADE,
  );


CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS audit_log (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name      TEXT,
    record_id       TEXT,
    operation_type  TEXT,
    changed_at      TIMESTAMP DEFAULT now(),
    changed_by      TEXT,
    original_values JSONB,
    new_values      JSONB
);


-- General
CREATE INDEX idx_user_username ON "User"(username);
CREATE INDEX IX_Staff_User_ID ON "Staff" ("User_ID");
CREATE INDEX IX_Patient_User_ID ON "Patient" ("user_id");
CREATE INDEX IX_Doctor_Staff_ID ON "Doctor" ("Staff_ID");
CREATE INDEX IX_Appointment_Patient_ID ON "Appointment" ("Patient_ID");
CREATE INDEX IX_DocApp_Doctor_ID ON "Doctor_Appointment" ("Doctor_ID");

CREATE INDEX idx_refresh_tokens_jti ON refersh_tokens(jti);


-- ===========================================
-- Trigger Function: Log changes to Patient or User table
-- ===========================================
CREATE OR REPLACE FUNCTION log_audit_changes()
RETURNS TRIGGER AS $$
DECLARE
    acting_user INT;
BEGIN
    -- You can get the user performing the operation from session context if available
    -- For now, assume User_ID is passed through a session variable (optional)
    BEGIN
        acting_user := current_setting('app.current_user_id', true)::INT;
    EXCEPTION WHEN OTHERS THEN
        acting_user := NULL; -- fallback if not set
    END;

    -- Insert audit record
    INSERT INTO Audit_Log (
        Audit_ID,
        User_ID,
        Action_Type,
        Table_Affected,
        Timestamp
    )
    VALUES (
        gen_random_uuid(),
        acting_user,
        TG_OP,           -- 'INSERT', 'UPDATE', or 'DELETE'
        TG_TABLE_NAME,   -- 'Patient' or 'User'
        NOW()
    );

    RETURN NULL; -- after triggers don’t modify data
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER patient_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON Patient
FOR EACH ROW
EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER user_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON "User"
FOR EACH ROW
EXECUTE FUNCTION log_audit_changes();

CREATE TRIGGER staff_audit_trigger
AFTER INSERT OR UPDATE OR DELETE ON "Staff"
FOR EACH ROW
EXECUTE FUNCTION log_audit_changes();



-- Nisal Wilochana

-- Procedure to get branch statistics for branch manager dashboard
CREATE OR REPLACE PROCEDURE get_branch_statistics(
    IN p_branch_name VARCHAR(50),
    OUT total_appointments INT,
    OUT completed_appointments INT,
    OUT pending_appointments INT,
    OUT total_doctors INT,
    OUT total_staff INT,
    OUT total_patients INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Total appointments
    SELECT COUNT(*) INTO total_appointments
    FROM "Appointment"
    WHERE "Branch_Name" = p_branch_name;

    -- Completed appointments
    SELECT COUNT(*) INTO completed_appointments
    FROM "Appointment"
    WHERE "Branch_Name" = p_branch_name AND "Status" = 'Completed';

    -- Pending appointments
    SELECT COUNT(*) INTO pending_appointments
    FROM "Appointment"
    WHERE "Branch_Name" = p_branch_name AND "Status" = 'Pending';

    -- Total doctors in branch
    SELECT COUNT(*) INTO total_doctors
    FROM "Doctor" d
    JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
    WHERE s."Branch_Name" = p_branch_name;

    -- Total staff in branch
    SELECT COUNT(*) INTO total_staff
    FROM "Staff"
    WHERE "Branch_Name" = p_branch_name;

    -- Total patients (patients who have appointments at this branch)
    SELECT COUNT(DISTINCT "Patient_ID") INTO total_patients
    FROM "Appointment"
    WHERE "Branch_Name" = p_branch_name;
END;
$$;

-- Procedure to get branch manager dashboard data
CREATE OR REPLACE PROCEDURE get_branch_manager_dashboard(
    IN p_branch_name VARCHAR(50),
    OUT dashboard_data JSONB
)
LANGUAGE plpgsql
AS $$
DECLARE
    stats RECORD;
    recent_appointments JSONB;
    upcoming_appointments JSONB;
    staff_list JSONB;
BEGIN
    -- Get statistics
    CALL get_branch_statistics(p_branch_name, 
        stats.total_appointments, 
        stats.completed_appointments, 
        stats.pending_appointments, 
        stats.total_doctors, 
        stats.total_staff, 
        stats.total_patients);

    -- Get recent appointments (last 7 days)
    SELECT jsonb_agg(
        jsonb_build_object(
            'appointment_id', "Appointment_ID",
            'patient_name', u.name,
            'appointment_date', "Appointment_Date",
            'status', "Status",
            'type', "Type"
        )
    ) INTO recent_appointments
    FROM "Appointment" a
    JOIN "Patient" p ON a."Patient_ID" = p.patient_id
    JOIN "User" u ON p.user_id = u.user_id
    WHERE a."Branch_Name" = p_branch_name
    AND a."Appointment_Date" >= CURRENT_DATE - INTERVAL '7 days'
    ORDER BY a."Appointment_Date" DESC
    LIMIT 10;

    -- Get upcoming appointments (next 7 days)
    SELECT jsonb_agg(
        jsonb_build_object(
            'appointment_id', "Appointment_ID",
            'patient_name', u.name,
            'appointment_date', "Appointment_Date",
            'start_time', da."Start_Time",
            'doctor_name', du.name,
            'status', "Status"
        )
    ) INTO upcoming_appointments
    FROM "Appointment" a
    JOIN "Patient" p ON a."Patient_ID" = p.patient_id
    JOIN "User" u ON p.user_id = u.user_id
    JOIN "Doctor_Appointment" da ON a."Appointment_ID" = da."Appointment_ID"
    JOIN "Doctor" d ON da."Doctor_ID" = d."Doctor_ID"
    JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
    JOIN "User" du ON s."User_ID" = du.user_id
    WHERE a."Branch_Name" = p_branch_name
    AND a."Appointment_Date" BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND a."Status" = 'Pending'
    ORDER BY a."Appointment_Date", da."Start_Time"
    LIMIT 10;

    -- Get staff list
    SELECT jsonb_agg(
        jsonb_build_object(
            'staff_id', s."Staff_ID",
            'name', u.name,
            'role', u.user_type,
            'username', u.username
        )
    ) INTO staff_list
    FROM "Staff" s
    JOIN "User" u ON s."User_ID" = u.user_id
    WHERE s."Branch_Name" = p_branch_name;

    -- Combine all data
    dashboard_data := jsonb_build_object(
        'statistics', jsonb_build_object(
            'total_appointments', stats.total_appointments,
            'completed_appointments', stats.completed_appointments,
            'pending_appointments', stats.pending_appointments,
            'total_doctors', stats.total_doctors,
            'total_staff', stats.total_staff,
            'total_patients', stats.total_patients
        ),
        'recent_appointments', COALESCE(recent_appointments, '[]'::jsonb),
        'upcoming_appointments', COALESCE(upcoming_appointments, '[]'::jsonb),
        'staff_list', COALESCE(staff_list, '[]'::jsonb)
    );
END;
$$;

-- Nisal Wilochana
CREATE OR REPLACE FUNCTION assign_default_salary()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_user_type VARCHAR(20);
    v_default_salary DECIMAL(10,2);
BEGIN
    -- Get user type
    SELECT user_type INTO v_user_type
    FROM "User"
    WHERE user_id = NEW."User_ID";
    
    -- Set default salary based on role
    CASE v_user_type
        WHEN 'doctor' THEN v_default_salary := 80000.00;
        WHEN 'nurse' THEN v_default_salary := 40000.00;
        WHEN 'pharmacist' THEN v_default_salary := 50000.00;
        WHEN 'lab-coordinator' THEN v_default_salary := 45000.00;
        WHEN 'lab-assistant' THEN v_default_salary := 30000.00;
        WHEN 'receptionist' THEN v_default_salary := 25000.00;
        ELSE v_default_salary := 25000.00;
    END CASE;
    
    -- Set salary if not provided or is 0
    IF NEW."Salary" IS NULL OR NEW."Salary" = 0 THEN
        NEW."Salary" := v_default_salary;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Yasith , Hasini 
CREATE OR REPLACE PROCEDURE insert_appointment (
                IN p_patient_id INT,
                IN p_doctor_id INT,
                IN p_date DATE,
                IN p_status VARCHAR,
                IN p_start_time TIME,
                IN p_type VARCHAR,
                IN p_branch VARCHAR,
                IN p_specialization_id INT
            )
            LANGUAGE plpgsql
            AS $$
            DECLARE
                v_appointment_id INT;
            BEGIN
                BEGIN
                    INSERT INTO "Appointment" ("Patient_ID", "Appointment_Date", "Status", "Type", "Branch_Name")
                    VALUES (p_patient_id, p_date, p_status, p_type, p_branch)
                    RETURNING "Appointment_ID" INTO v_appointment_id;      

                    INSERT INTO "Doctor_Appointment" ("Appointment_ID", "Doctor_ID", "Start_Time", "Is_Emergency", "Specialization_ID")
                    VALUES (v_appointment_id, p_doctor_id, p_start_time, False, p_specialization_id);

                    INSERT INTO "Billing" ("Appointment_ID", "Total_Amount", "Due_Date")
                    VALUES (v_appointment_id, 
                        (
                            SELECT "Consultation_Fee"
                            FROM "Specilization"
                            WHERE "Specialization_ID" = p_specialization_id
                        )
                    , p_date + INTERVAL '30 days');
                        
                    COMMIT;
                EXCEPTION WHEN OTHERS THEN
                    ROLLBACK;  
                    RAISE NOTICE 'Transaction failed: %', SQLERRM;
                END;
            END;
            $$;
;

-- Yasith

-- Procedure to process payments with automatic bill status updates
CREATE OR REPLACE PROCEDURE process_payment(
    IN p_bill_id INT,
    IN p_amount DECIMAL(10,2),
    IN p_payment_method VARCHAR(50),
    IN p_payment_notes TEXT DEFAULT NULL,
    OUT p_payment_id INT,
    OUT p_remaining_balance DECIMAL(10,2),
    OUT p_bill_status VARCHAR(20)
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_total_amount DECIMAL(10,2);
    v_patient_amount DECIMAL(10,2);
    v_total_paid DECIMAL(10,2);
    v_new_total_paid DECIMAL(10,2);
BEGIN
    -- Get bill details
    SELECT "Total_Amount", "Patient_Amount" 
    INTO v_total_amount, v_patient_amount
    FROM "Billing"
    WHERE "Bill_ID" = p_bill_id;
    
    IF v_total_amount IS NULL THEN
        RAISE EXCEPTION 'Bill not found: %', p_bill_id;
    END IF;
    
    -- Calculate total payments made
    SELECT COALESCE(SUM("Amount"), 0) INTO v_total_paid
    FROM "Payment"
    WHERE "Bill_ID" = p_bill_id;
    
    v_new_total_paid := v_total_paid + p_amount;
    
    -- Validate payment amount
    IF v_new_total_paid > v_patient_amount THEN
        RAISE EXCEPTION 'Payment exceeds remaining balance. Remaining: %, Attempted: %', 
            (v_patient_amount - v_total_paid), p_amount;
    END IF;
    
    -- Insert payment record
    INSERT INTO "Payment" ("Bill_ID", "Amount", "Date_Time", "Payment_Method")
    VALUES (p_bill_id, p_amount, CURRENT_TIMESTAMP, p_payment_method)
    RETURNING "Payment_ID" INTO p_payment_id;
    
    -- Update bill status
    p_remaining_balance := v_patient_amount - v_new_total_paid;
    
    IF p_remaining_balance <= 0 THEN
        p_bill_status := 'Paid';
        UPDATE "Billing" SET "Status" = 'Paid' WHERE "Bill_ID" = p_bill_id;
    ELSE
        p_bill_status := 'Partial';
        UPDATE "Billing" SET "Status" = 'Partial' WHERE "Bill_ID" = p_bill_id;
    END IF;
    
END;
$$;

-- Sandali 

-- Function to calculate patient age
CREATE OR REPLACE FUNCTION calculate_patient_age(p_patient_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_date_of_birth DATE;
    v_age INT;
BEGIN
    SELECT date_of_birth INTO v_date_of_birth
    FROM "Patient"
    WHERE patient_id = p_patient_id;
    
    IF v_date_of_birth IS NULL THEN
        RETURN NULL;
    END IF;
    
    v_age := EXTRACT(YEAR FROM AGE(CURRENT_DATE, v_date_of_birth));
    RETURN v_age;
END;
$$;

-- Viran

-- Function to calculate total revenue for a period
CREATE OR REPLACE FUNCTION calculate_revenue(
    p_start_date DATE,
    p_end_date DATE,
    p_branch_name VARCHAR(50) DEFAULT NULL
)
RETURNS TABLE(
    total_revenue DECIMAL(10,2),
    total_payments DECIMAL(10,2),
    outstanding_amount DECIMAL(10,2)
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(b."Total_Amount"), 0) as total_revenue,
        COALESCE(SUM(p."Amount"), 0) as total_payments,
        COALESCE(SUM(b."Patient_Amount"), 0) - COALESCE(SUM(p."Amount"), 0) as outstanding_amount
    FROM "Billing" b
    JOIN "Appointment" a ON b."Appointment_ID" = a."Appointment_ID"
    LEFT JOIN "Payment" p ON b."Bill_ID" = p."Bill_ID"
    WHERE a."Appointment_Date" BETWEEN p_start_date AND p_end_date
    AND (p_branch_name IS NULL OR a."Branch_Name" = p_branch_name);
END;
$$;

-- Hasini

-- Trigger to automatically update bill status when payments are made
CREATE OR REPLACE FUNCTION update_bill_status_on_payment()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
    v_patient_amount DECIMAL(10,2);
    v_total_paid DECIMAL(10,2);
    v_new_status VARCHAR(20);
BEGIN
    -- Get patient amount from billing
    SELECT "Patient_Amount" INTO v_patient_amount
    FROM "Billing"
    WHERE "Bill_ID" = NEW."Bill_ID";
    
    -- Calculate total payments
    SELECT COALESCE(SUM("Amount"), 0) INTO v_total_paid
    FROM "Payment"
    WHERE "Bill_ID" = NEW."Bill_ID";
    
    -- Determine new status
    IF v_total_paid >= v_patient_amount THEN
        v_new_status := 'Paid';
    ELSIF v_total_paid > 0 THEN
        v_new_status := 'Partial';
    ELSE
        v_new_status := 'Pending';
    END IF;
    
    -- Update billing status
    UPDATE "Billing"
    SET "Status" = v_new_status
    WHERE "Bill_ID" = NEW."Bill_ID";
    
    RETURN NEW;
END;
$$;

-- Yasith , Sandali, Hasini
-- View for appointment details with patient and doctor info
CREATE OR REPLACE VIEW appointment_details AS
SELECT 
    a."Appointment_ID",
    a."Appointment_Date",
    a."Status",
    a."Type",
    a."Branch_Name",
    u_patient.name as patient_name,
    u_patient.username as patient_username,
    u_doctor.name as doctor_name,
    da."Start_Time",
    da."Is_Emergency",
    sp."Specialization_Name"
FROM "Appointment" a
JOIN "Patient" p ON a."Patient_ID" = p.patient_id
JOIN "User" u_patient ON p.user_id = u_patient.user_id
LEFT JOIN "Doctor_Appointment" da ON a."Appointment_ID" = da."Appointment_ID"
LEFT JOIN "Doctor" d ON da."Doctor_ID" = d."Doctor_ID"
LEFT JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
LEFT JOIN "User" u_doctor ON s."User_ID" = u_doctor.user_id
LEFT JOIN "Specialization" sp ON da."Specialization_ID" = sp."Specialization_ID";


-- patient
-- View for billing summary with payment status
CREATE OR REPLACE VIEW billing_summary AS
SELECT 
    b."Bill_ID",
    b."Appointment_ID",
    b."Total_Amount",
    b."Insured_Amount",
    b."Patient_Amount",
    b."Status",
    b."Due_Date",
    COALESCE(SUM(p."Amount"), 0) as total_paid,
    (b."Patient_Amount" - COALESCE(SUM(p."Amount"), 0)) as remaining_amount,
    CASE 
        WHEN COALESCE(SUM(p."Amount"), 0) >= b."Patient_Amount" THEN 'Paid'
        WHEN COALESCE(SUM(p."Amount"), 0) > 0 THEN 'Partial'
        ELSE 'Pending'
    END as payment_status
FROM "Billing" b
LEFT JOIN "Payment" p ON b."Bill_ID" = p."Bill_ID"
GROUP BY b."Bill_ID", b."Appointment_ID", b."Total_Amount", b."Insured_Amount", b."Patient_Amount", b."Status", b."Due_Date";

