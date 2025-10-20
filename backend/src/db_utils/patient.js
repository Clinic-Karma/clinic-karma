import { sql } from './db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

export async function addPatient(payLoad) {
    const { name, nic, contact_number, address, username, password } = payLoad;
    const { dob, gender, emmergency_contact_number } = payLoad;

    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        // Insert the user first
        const userResult = await sql`
            INSERT INTO "User" (name, nic, contact_number, address, username, password_hash, user_type)
            VALUES (${name}, ${nic}, ${contact_number}, ${address}, ${username}, ${hash}, 'patient')
            RETURNING user_id
        `;

        // Then insert the patient using the returned user_id
        const patientResult = await sql`
            INSERT INTO "Patient" (user_id, date_of_birth, gender, emergency_contact)
            VALUES (${userResult[0].user_id}, ${dob}, ${gender}, ${emmergency_contact_number})
            RETURNING patient_id
        `;

        return {
            userId: userResult[0].user_id,
            patientId: patientResult[0].patient_id,
            username
        };
    } catch (error) {
        if (error.code === '23505' && error.constraint === 'unique_username') {
            throw new Error('Username already exists');
        }
        throw error;
    }
}

export async function getPatientID(username) {
    const result = await sql`
        SELECT p.patient_id
        FROM "Patient" p
        JOIN "User" u ON p.user_id = u.user_id
        WHERE u.username = ${username}
    `;
    if (!result || result.length === 0) {
        return null;

    }
    return result[0].patient_id;
}

export async function getPatientByUsername(username) {
    const result = await sql`
        SELECT 
            p.patient_id,
            p.date_of_birth,
            p.gender,
            p.emergency_contact,
            u.name,
            u.nic,
            u.contact_number,
            u.address,
            u.username
        FROM "Patient" p
        JOIN "User" u ON p.user_id = u.user_id
        WHERE u.username = ${username}
    `;
    return result[0];
}