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