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
            WHERE user_id    = ${userID};
        `;
        return result[0]?.patient_id;
    } catch (error) {
        console.error('Error fetching patient ID:', error);
        throw error;
    }   
}

export async function addAppointment(patientId, doctorId, date, status, startTime, type, branch, specializationId) {
    try {
        const [appointmentResult, doctorAppointmentResult] = await sql.transaction((txn) => [
            txn`
                INSERT INTO "Appointment" ("Patient_ID", "Appointment_Date", "Status", "Type", "Branch_Name")
                VALUES (${patientId}, ${date}, ${status}, ${type}, ${branch})
                RETURNING "Appointment_ID";
            `,
            txn`
                INSERT INTO "Doctor_Appointment" ("Appointment_ID", "Doctor_ID", "Start_Time", "Is_Emergency", "Specialization_ID")
                VALUES (
                    (SELECT "Appointment_ID"
                    FROM "Appointment"
                    WHERE "Patient_ID" = ${patientId} AND "Appointment_Date" = ${date}
                    ORDER BY "Appointment_ID" DESC
                    LIMIT 1),
                    ${doctorId},
                    ${startTime},
                    False,
                    ${specializationId}
                );
            `
        ]);

        const { appointment_id } = appointmentResult;
        const { doctor_appointment_id } = doctorAppointmentResult;

        return { appointment_id, doctor_appointment_id };
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
            SELECT lr."Report_ID", lr."Test_Name", lr."Report_Date", lr."Findings", lr."Doctor_ID"
            FROM "Lab_Report" lr
            WHERE lr."Patient_ID" = ${patientId}
            ORDER BY lr."Report_Date" DESC;
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