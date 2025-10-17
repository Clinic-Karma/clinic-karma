import { sql } from './db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function addPatient(payLoad) {
    const { name, nic, contact_number, address, username, password } = payLoad;
    const { dob, gender, emmergency_contact_number } = payLoad;

    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        const [userResult, patientResult] = await sql.transaction((txn) => [
                txn`
                INSERT INTO "User" (name, nic, contact_number, address, username, password_hash, user_type) 
                VALUES (${name}, ${nic}, ${contact_number}, ${address}, ${username}, ${hash}, 'patient')
                RETURNING user_id, username;
            `,
                txn`
                INSERT INTO "Patient" (user_id, date_of_birth, gender, emergency_contact)
                VALUES ((SELECT user_id FROM "User" WHERE username = ${username}), ${dob}, ${gender}, ${emmergency_contact_number})
                RETURNING patient_id;`
        ]);

        const { user_id } = userResult;
        const { patient_id } = patientResult;

        return { user_id, patient_id, username };
    }
    catch (error) {
        console.error('Error registering patient:', error);
        throw error;
    }
} 

export async function getPatientID(userID) {
    try {
        const result = await sql`
            SELECT patient_id 
            FROM "Patient" 
            WHERE user_id = ${userID};
        `;
        return result[0]?.patient_id;
    } catch (error) {
        console.error('Error fetching patient ID:', error);
        throw error;
    }   
}

export async function addAppointment(patientId, doctorId, date, status, startTime, type, branch, specializationId) {
    try {
        const x = await sql`
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
                        
                    COMMIT;  -- Commit if all is successful
                EXCEPTION WHEN OTHERS THEN
                    ROLLBACK;  -- Rollback if any error occurs
                    RAISE NOTICE 'Transaction failed: %', SQLERRM;
                END;
            END;
            $$;
        `;


        await sql`CALL insert_appointment (
                ${patientId},
                ${doctorId},
                ${date},
                ${status},
                ${startTime},
                ${type},
                ${branch},
                ${specializationId}
            );
        `;  

        return;
    } catch (error) {
        console.error('Error adding appointment:', error);
        throw error;
    }
}


export async function getAppointmentsByPatient(patientId) { 
    try {
        const result = await sql`
            SELECT a."Appointment_ID", a."Appointment_Date", a."Status", a."Type", a."Branch_Name",
                     da."Doctor_ID", da."Start_Time", da."Is_Emergency", s."Specialization_Name", u.name
            FROM "Appointment" a
            INNER JOIN "Doctor_Appointment" da ON a."Appointment_ID" = da."Appointment_ID"
            INNER JOIN "Doctor" d ON da."Doctor_ID" = d."Doctor_ID"
            INNER JOIN "Specialization" s ON s."Specialization_ID" = da."Specialization_ID"
            INNER JOIN "Staff" st ON st."Staff_ID" = d."Staff_ID"
            INNER JOIN "User" u ON u.user_id = st."User_ID"
            WHERE a."Patient_ID" = ${patientId}
            ORDER BY a."Appointment_Date" DESC;
        `;
        return result;
    }
    catch (error) {
        console.error('Error fetching appointments:', error);
        throw error;
    }
}

export async function getLabReportsByPatient(patientId) {
    try {
        const result = await sql`
            
        `;
        return result;
    }
    catch (error) {
        console.error('Error fetching lab reports:', error);
        throw error;
    }
}

export async function getPaymentsByPatient(patientId) {
    try {
        const result = await sql`
            SELECT p."Payment_ID", p."Amount", p."Payment_Date", p."Description", p."Status"
            FROM "Payment" p
            WHERE p."Patient_ID" = ${patientId}
            ORDER BY p."Payment_Date" DESC;
        `;
        return result;
    }
    catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }
}