import { sql } from './db.js';

export async function getSpelizations() {
    try {
        const specializations = await sql`
            SELECT "Specialization_ID", "Specialization_Name" 
            FROM "Specialization"
            ORDER BY "Specialization_Name";
        `;
        return specializations;
    }
    catch (error) {
        console.log('Error fetching specializations:', error);
        throw error;
    }
}

export async function getDoctorsBySpecialization_Branch(specializationId, Branch) {
    try {
        const doctors = await sql`
            SELECT d."Doctor_ID", u."name" AS "Doctor_Name"
            FROM "Doctor" d 
            JOIN "Staff" s USING("Staff_ID")
            JOIN "User" u ON u.user_id = s."User_ID"
            JOIN "Doctor_Specialization" ds ON d."Doctor_ID" = ds."Doctor_ID"
            JOIN "Specialization" sp ON ds."Specialization_ID" = sp."Specialization_ID"
            WHERE sp."Specialization_ID" = ${specializationId} AND s."Branch_Name" = ${Branch}
            ORDER BY u."name";
        `;
        return doctors;
    }
    catch (error) {
        console.log('Error fetching doctors by specialization and branch:', error);
        throw error;
    }
}

export async function getAvailableTimeSlots(doctorId, date) {
    try {
        const timeSlots = await sql`
            SELECT da."Start_Time", COUNT(*) AS "BookedCount"
            FROM "Doctor_Appointment" da
            INNER JOIN "Appointment" a ON da."Appointment_ID" = a."Appointment_ID"
            WHERE "Doctor_ID" = ${doctorId} AND a."Appointment_Date" = ${date}
            GROUP BY "Start_Time"
            ORDER BY "Start_Time";
        `;
        return timeSlots;
    } catch (error) {
        console.log('Error fetching available time slots:', error);
        throw error;
    }   
}

export async function getUpcomingAppointments(doctorID, date) {
    try {

        const appointment = sql`
            SELECT a."Appointment_ID" as id, u.name as patient, p.patient_id as "patientId", 
             da."Start_Time" as time, a."Appointment_Date" as date, a."Type" as type, 
             a."Status" as status, u.contact_number as contact
            FROM "Appointment" a
            JOIN "Doctor_Appointment" da ON a."Appointment_ID" = da."Appointment_ID"
            JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            JOIN "User" u ON p.user_id = u.user_id
            WHERE da."Doctor_ID" = ${doctorID} AND a."Appointment_Date" = ${date} AND a."Status" != 'Completed'
            ORDER BY da."Start_Time";
        `; 

        return appointment;
    }
    catch (error) {
        console.error("Error while fetching appointmtnts", error);
        throw error;
    }
}

export async function getPatients(doctorID) {
    try {
        const patients = sql`
            SELECT DISTINCT p.patient_id as id, u.name, p.patient_id,
            u.contact_number as phone
            FROM "Patient" p
            INNER JOIN "User" u ON p.user_id = u.user_id
            INNER JOIN "Appointment" a ON p.patient_id = a."Patient_ID" 
            INNER JOIN "Doctor_Appointment" da ON a."Appointment_ID" = da."Appointment_ID"
            WHERE da."Doctor_ID" = ${doctorID}
            GROUP BY p.patient_id, u.contact_number, u.name;        
        `
        return patients;
    }
    catch (error) {
        console.error("Error while fetching parients", error);
        throw error;
    }
}

export async function updateAppointmentDetails(appointmentID, diagnosis, prescription, notes) {
    try {

        const x = sql.transaction((tnx) => [
            tnx`UPDATE "Doctor_Appointment"
        SET 
            "Diagnosis" = ${diagnosis},
            "Prescription" = ${prescription},
            "Additional_Notes" = ${notes}
        WHERE "Appointment_ID" = ${appointmentID}
        RETURNING "Appointment_ID";`,
            tnx`UPDATE "Appointment"
        SET 
            "Status" = 'Completed'
        WHERE "Appointment_ID" = ${appointmentID}
        RETURNING "Appointment_ID";`
        ]);

        return x;
    }
    catch (err) {
        console.error("Error while updating parients", err);
        throw err;
    }
}