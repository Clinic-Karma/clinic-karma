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