import { sql } from './db.js';

export const getSpecializations = async () => {
    const result = await sql`
        SELECT 
            "Specialization_ID" as id,
            "Specialization_Name" as name
        FROM "Specialization"
        ORDER BY "Specialization_Name"
    `;
    return result;
};

export const getDoctorsBySpecializationAndBranch = async (specializationId, branch) => {
    const result = await sql`
        SELECT 
            d."Doctor_ID" as id,
            u.name as name
        FROM "Doctor" d
        JOIN "Doctor_Specialization" ds ON d."Doctor_ID" = ds."Doctor_ID"
        JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
        JOIN "User" u ON s."User_ID" = u.user_id
        WHERE ds."Specialization_ID" = ${specializationId}
        AND s."Branch_Name" = ${branch}
        ORDER BY d."Doctor_ID"
    `;
    return result;
};

export const getDoctorById = async (doctorId) => {
    const result = await sql`
        SELECT 
            d.*,
            s.name as specialization_name
        FROM doctors d
        JOIN specializations s ON d.specialization_id = s.id
        WHERE d.id = ${doctorId}
    `;
    return result[0];
};

export const createDoctor = async (doctorData) => {
    const {
        name,
        specialization_id,
        branch,
        available_days,
        start_time,
        end_time
    } = doctorData;

    const result = await sql`
        INSERT INTO doctors (
            name,
            specialization_id,
            branch,
            available_days,
            start_time,
            end_time
        )
        VALUES (
            ${name},
            ${specialization_id},
            ${branch},
            ${available_days},
            ${start_time},
            ${end_time}
        )
        RETURNING *
    `;

    return result[0];
};

export const updateDoctor = async (doctorId, updates) => {
    const validFields = [
        'name',
        'specialization_id',
        'branch',
        'available_days',
        'start_time',
        'end_time'
    ];

    const setClauses = [];

    for (const key of Object.keys(updates)) {
        if (validFields.includes(key)) {
            setClauses.push(`${key} = ${updates[key]}`);
        }
    }

    if (setClauses.length === 0) {
        throw new Error('No valid fields to update');
    }

    const setClause = setClauses.join(', ');

    const result = await sql`
        UPDATE doctors
        SET ${sql(setClause)}
        WHERE id = ${doctorId}
        RETURNING *
    `;

    return result[0];
};

export const deleteDoctor = async (doctorId) => {
    await sql`
        DELETE FROM doctors 
        WHERE id = ${doctorId}
    `;
};

export const getDoctorSchedule = async (doctorId, date) => {
    const result = await sql`
        SELECT 
            a.id,
            a.patient_username,
            a.appointment_date,
            a.time_slot
        FROM appointments a
        WHERE a.doctor_id = ${doctorId} 
        AND a.appointment_date = ${date}
        ORDER BY a.time_slot
    `;
    
    return result;
};

export async function getUpcomingAppointments(doctorID, today) {
    // TODO: Implement actual query for upcoming appointments for doctorID
    // Example:
    // const result = await sql`SELECT * FROM appointments WHERE doctor_id = ${doctorID} AND appointment_date >= ${today}`;
    // return result;
    return [];
}

export async function getPatients(doctorID) {
    // TODO: Implement actual query for patients for doctorID
    return [];
}

export async function updateAppointmentDetails(appointmentId, diagnosis, prescription, additional_notes) {
    // TODO: Implement actual update query for appointment details
    return true;
}