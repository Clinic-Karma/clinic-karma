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