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

        const res = await sql`
                    INSERT INTO "Appointment" ("Patient_ID", "Appointment_Date", "Status", "Type", "Branch_Name")
                    VALUES (${patientId}, ${date}, ${status}, ${type}, ${branch})
                    RETURNING "Appointment_ID" as id;`;
        
        const appintment_id = res[0].id;
        const dueDate = new Date(date);
        dueDate.setDate(dueDate.getDate() + 30);

        await sql`INSERT INTO "Doctor_Appointment" ("Appointment_ID", "Doctor_ID", "Start_Time", "Is_Emergency", "Specialization_ID")
                    VALUES (${appintment_id}, ${doctorId}, ${startTime}, ${false}, ${specializationId});`;

        await sql`INSERT INTO "Billing" ("Appointment_ID", "Total_Amount", "Due_Date")
                    VALUES (${appintment_id}, 
                        (
                            SELECT "Consultation_Fee"
                            FROM "Specialization"
                            WHERE "Specialization_ID" = ${specializationId}
                        )
                , ${dueDate});`;

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
            SELECT ta."Appointment_ID" as appintment_id,
                   ta."Report_Links" as link, c."Treatment_name" as name,
                   a."Appointment_Date" as date 
            FROM "Treatment_Appointment" ta
            INNER JOIN "Appointment" a ON ta."Appointment_ID" = a."Appointment_ID"
            INNER JOIN "Catalogue" c ON ta."Catalogue_ID" = c."Catalogue_ID"
            WHERE a."Patient_ID" = ${patientId}
            ORDER BY a."Appointment_Date" DESC
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
            SELECT p."Payment_ID" as id , p."Amount" as amount, p."Date_Time" as date, p."Payment_Method" as method
            FROM "Payment" p
            INNER JOIN "Billing" b ON p."Bill_ID" = b."Bill_ID"
            INNER JOIN "Appointment" a ON b."Appointment_ID" = a."Appointment_ID"
            INNER JOIN "Patient" pt ON a."Patient_ID" = pt.patient_id
            WHERE pt.patient_id = ${patientId}
            ORDER BY p."Date_Time" DESC;
        `;
        return result;
    }
    catch (error) {
        console.error('Error fetching payments:', error);
        throw error;
    }
}

export async function getBillsByPatient(patientId) {
    try {
        const result = await sql`
            SELECT b."Bill_ID" as id, b."Total_Amount" as total_amount, b."Due_Date" as due_date, 
                   a."Appointment_ID" as appointment_id, b."Insured_Amount" as insured_amount,
                   b."Patient_Amount" as patient_amount
            FROM "Billing" b
            INNER JOIN "Appointment" a ON b."Appointment_ID" = a."Appointment_ID"
            INNER JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            WHERE p.patient_id = ${patientId}
            ORDER BY b."Due_Date" DESC;
        `;
        return result;
    }
    catch (error) {
        console.error('Error fetching bills:', error);
        throw error;
    }
}