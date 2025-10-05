import sql from './db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function addPatient(payLoad) {
    const { name, nic, contact_number, address, username, password } = payLoad;
    const { dob, gender, emmergency_contact_number } = payLoad;

    try {
        const hash = await bcrypt.hash(password, SALT_ROUNDS);

        const [userResult, patientResult] = await sql.transaction((txn) => [
                txn`
                INSERT INTO "User" (Name, NIC, Contact_Number, Address, Username, Password_Hash, User_Type) 
                VALUES (${name}, ${nic}, ${contact_number}, ${address}, ${username}, ${hash}, 'patient')
                RETURNING user_id, username;
            `,
                txn`
                INSERT INTO patient (user_id, Date_Of_Birth, Gender, Emergency_Contact)
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