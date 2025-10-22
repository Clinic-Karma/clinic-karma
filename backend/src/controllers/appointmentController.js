import { sql } from '../db_utils/db.js';
import * as appointmentDb from '../db_utils/appointment.js';
import * as doctorDb from '../db_utils/doctor.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;


// Get all patients for testing
export const getAllPatients = async (req, res) => {
    try {
        const result = await sql`
            SELECT username, name, user_type 
            FROM "User" 
            WHERE user_type = 'patient'
            ORDER BY username
        `;
        
        res.json({
            success: true,
            patients: result
        });
    } catch (error) {
        console.error('Error fetching patients:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch patients',
            error: error.message
        });
    }
};

// Get all doctors for testing
export const getAllDoctors = async (req, res) => {
    try {
        const result = await sql`
            SELECT 
                d."Doctor_ID" as id, 
                u.name, 
                s."Branch_Name" as branch,
                u.user_type,
                COALESCE(
                    ARRAY_AGG(sp."Specialization_Name") FILTER (WHERE sp."Specialization_Name" IS NOT NULL), 
                    ARRAY['No Specialization']
                ) as specializations
            FROM "Doctor" d
            JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
            JOIN "User" u ON s."User_ID" = u.user_id
            LEFT JOIN "Doctor_Specialization" ds ON d."Doctor_ID" = ds."Doctor_ID"
            LEFT JOIN "Specialization" sp ON ds."Specialization_ID" = sp."Specialization_ID"
            GROUP BY d."Doctor_ID", u.name, s."Branch_Name", u.user_type
            ORDER BY d."Doctor_ID"
        `;
        
        res.json({
            success: true,
            doctors: result
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error.message
        });
    }
};

// Get all staff for testing
export const getAllStaff = async (req, res) => {
    try {
        const result = await sql`
            SELECT 
                s."Staff_ID" as id, 
                u.name, 
                s."Branch_Name" as branch,
                u.user_type,
                CASE 
                  WHEN u.user_type = 'receptionist' THEN 'Receptionist'
                  WHEN u.user_type = 'lab-assistant' THEN 'Lab Coordinator'
                  ELSE u.user_type
                END as role
            FROM "Staff" s
            JOIN "User" u ON s."User_ID" = u.user_id
            WHERE u.user_type IN ('receptionist', 'lab-assistant')
            ORDER BY s."Staff_ID"
        `;
        
        res.json({
            success: true,
            staff: result
        });
    } catch (error) {
        console.error('Error fetching staff:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch staff',
            error: error.message
        });
    }
};

// Create a new staff member
export const createStaff = async (req, res) => {
    try {
        const { name, role, address, username, password, contact, email, nic, branch = 'Colombo' } = req.body;
        
        // Validate required fields
        if (!name || !role || !username || !password || !contact || !nic) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, role, username, password, contact, and NIC are required' 
            });
        }

        // Validate email format if provided
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid email format' 
            });
        }

        // Validate role - updated to handle both old and new role values
        const validRoles = ['receptionist', 'lab-assistant', 'lab-coordinator'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Role must be either "receptionist" or "lab-coordinator"' 
            });
        }

        // Map lab-coordinator to lab-assistant for database consistency
        const dbRole = role === 'lab-coordinator' ? 'lab-assistant' : role;

        // Hash the password before storing
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Sanitize phone number to fit database constraint (VARCHAR 15)
        let sanitizedContact = contact.replace(/[\s\-\(\)]/g, '');
        if (sanitizedContact.length > 15) {
            sanitizedContact = sanitizedContact.substring(0, 15);
        }

        // Create staff without transaction (neon serverless doesn't support transactions)
        // 1. Create user first - let database handle auto-increment
        const userResult = await sql`
            INSERT INTO "User" (name, nic, contact_number, address, username, password_hash, user_type, email)
            VALUES (${name}, ${nic}, ${sanitizedContact}, ${address}, ${username}, ${passwordHash}, ${dbRole}, ${email || null})
            RETURNING user_id
        `;
        
        const userId = userResult[0].user_id;

        // 2. Create staff record - let database handle auto-increment
        const staffResult = await sql`
            INSERT INTO "Staff" ("User_ID", "Branch_Name")
            VALUES (${userId}, ${branch})
            RETURNING "Staff_ID"
        `;
        
        const staffId = staffResult[0].Staff_ID;

        const result = { userId, staffId };

        res.status(201).json({ 
            success: true, 
            message: 'Staff created successfully',
            data: result 
        });
    } catch (error) {
        console.error('Error creating staff:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Create a new doctor
export const createDoctor = async (req, res) => {
    try {
        const { name, specialization, address, username, password, contact, nic, branch = 'Colombo' } = req.body;
        
        // Validate required fields
        if (!name || !username || !password || !contact || !nic) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, username, password, contact, and NIC are required' 
            });
        }

        // Hash the password before storing
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Create doctor without transaction (neon serverless doesn't support transactions)
        // Use a retry mechanism to handle sequence conflicts
        let userResult;
        let retryCount = 0;
        const maxRetries = 3;

        // Sanitize phone number to fit database constraint (VARCHAR 15)
        let sanitizedContact = contact.replace(/[\s\-\(\)]/g, '');
        if (sanitizedContact.length > 15) {
            sanitizedContact = sanitizedContact.substring(0, 15);
        }

        while (retryCount < maxRetries) {
            try {
                // 1. Create user first - let database handle auto-increment
                userResult = await sql`
                    INSERT INTO "User" (name, nic, contact_number, address, username, password_hash, user_type)
                    VALUES (${name}, ${nic}, ${sanitizedContact}, ${address}, ${username}, ${passwordHash}, 'doctor')
                    RETURNING user_id
                `;
                break; // Success, exit retry loop
            } catch (error) {
                if (error.message.includes('duplicate key value violates unique constraint') && retryCount < maxRetries - 1) {
                    retryCount++;
                    console.log(`Retry ${retryCount} for user creation due to sequence conflict`);
                    // Wait a bit before retrying
                    await new Promise(resolve => setTimeout(resolve, 100));
                    continue;
                } else {
                    throw error; // Re-throw if max retries reached or different error
                }
            }
        }
        
        const userId = userResult[0].user_id;

        // 2. Create staff record - with retry logic
        let staffResult;
        retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                staffResult = await sql`
                    INSERT INTO "Staff" ("User_ID", "Branch_Name")
                    VALUES (${userId}, ${branch})
                    RETURNING "Staff_ID"
                `;
                break; // Success, exit retry loop
            } catch (error) {
                if (error.message.includes('duplicate key value violates unique constraint') && retryCount < maxRetries - 1) {
                    retryCount++;
                    console.log(`Retry ${retryCount} for staff creation due to sequence conflict`);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    continue;
                } else {
                    throw error;
                }
            }
        }
        
        const staffId = staffResult[0].Staff_ID;

        // 3. Create doctor record - with retry logic
        let doctorResult;
        retryCount = 0;

        while (retryCount < maxRetries) {
            try {
                // Get next available Doctor_ID
                const maxDoctorIdResult = await sql`SELECT COALESCE(MAX("Doctor_ID"), 0) + 1 as next_id FROM "Doctor"`;
                const nextDoctorId = maxDoctorIdResult[0].next_id;

                doctorResult = await sql`
                    INSERT INTO "Doctor" ("Doctor_ID", "Staff_ID")
                    VALUES (${nextDoctorId}, ${staffId})
                    RETURNING "Doctor_ID"
                `;
                break; // Success, exit retry loop
            } catch (error) {
                if (error.message.includes('duplicate key value violates unique constraint') && retryCount < maxRetries - 1) {
                    retryCount++;
                    console.log(`Retry ${retryCount} for doctor creation due to sequence conflict`);
                    await new Promise(resolve => setTimeout(resolve, 100));
                    continue;
                } else {
                    throw error;
                }
            }
        }
        
        const doctorId = doctorResult[0].Doctor_ID;

        // 4. Add specialization if provided
        if (specialization && specialization.trim() !== '' && specialization !== 'No Specialization') {
            const specResult = await sql`
                SELECT "Specialization_ID" FROM "Specialization" 
                WHERE LOWER("Specialization_Name") = LOWER(${specialization})
            `;
            
            if (specResult.length > 0) {
                await sql`
                    INSERT INTO "Doctor_Specialization" ("Doctor_ID", "Specialization_ID")
                    VALUES (${doctorId}, ${specResult[0].Specialization_ID})
                `;
                console.log(`Added specialization ${specialization} for doctor ${doctorId}`);
            } else {
                console.warn(`Specialization not found: ${specialization}`);
            }
        }

        const result = { userId, staffId, doctorId };

        res.status(201).json({ 
            success: true, 
            message: 'Doctor created successfully',
            data: result 
        });
    } catch (error) {
        console.error('Error creating doctor:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Check database tables
export const checkDatabaseTables = async (req, res) => {
    try {
        const result = await sql`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name
        `;
        
        res.json({
            success: true,
            tables: result.map(row => row.table_name)
        });
    } catch (error) {
        console.error('Error checking tables:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check tables',
            error: error.message
        });
    }
};

// Check Doctor table structure
export const checkDoctorTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Doctor' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Doctor table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Doctor table structure',
            error: error.message
        });
    }
};

// Check Staff table structure
export const checkStaffTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Staff' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Staff table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Staff table structure',
            error: error.message
        });
    }
};

// Check User table structure
export const checkUserTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'User' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking User table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check User table structure',
            error: error.message
        });
    }
};

// Check Appointment table structure
export const checkAppointmentTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Appointment' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Appointment table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Appointment table structure',
            error: error.message
        });
    }
};

// Check Patient table structure
export const checkPatientTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Patient' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Patient table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Patient table structure',
            error: error.message
        });
    }
};

// Get all branches
export const getAllBranches = async (req, res) => {
    try {
        const result = await sql`
            SELECT * FROM "Branch"
            ORDER BY "Branch_Name"
        `;
        
        res.json({
            success: true,
            branches: result
        });
    } catch (error) {
        console.error('Error fetching branches:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch branches',
            error: error.message
        });
    }
};

export const bookAppointment = async (req, res) => {
    console.log('Book appointment request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { patientUsername, doctorId, appointmentDate, timeSlot, specialization, branch } = req.body;
    
    console.log('=== Book Appointment Debug Info ===');
    console.log('Patient Username:', patientUsername);
    console.log('Doctor ID:', doctorId);
    console.log('Appointment Date:', appointmentDate);
    console.log('Time Slot:', timeSlot);
    console.log('Specialization:', specialization);
    console.log('Branch:', branch);
    console.log('=====================================');

    try {
        // Validate that the patient exists
        const patientCheck = await sql`
            SELECT user_id FROM "User" WHERE username = ${patientUsername} AND user_type = 'patient'
        `;
        
        if (!patientCheck || patientCheck.length === 0) {
            console.log(`Patient validation failed for username: ${patientUsername}`);
            return res.status(404).json({
                success: false,
                message: `Patient with username '${patientUsername}' not found. Please ensure the patient is registered.`
            });
        }

        // Validate that the doctor exists
        const doctorCheck = await sql`
            SELECT "Doctor_ID" FROM "Doctor" WHERE "Doctor_ID" = ${doctorId}
        `;
        
        if (!doctorCheck || doctorCheck.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }

        // Check if the time slot is available
        const availableSlots = await appointmentDb.getAvailableTimeSlots(doctorId, appointmentDate);
        if (!availableSlots.includes(timeSlot)) {
            return res.status(409).json({
                success: false,
                message: 'Time slot is not available'
            });
        }

        // Check if patient already has an appointment on the same date
        const existingAppointment = await sql`
            SELECT a."Appointment_ID" 
            FROM "Appointment" a
            JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            JOIN "User" u ON p.user_id = u.user_id
            WHERE u.username = ${patientUsername} 
            AND DATE(a."Appointment_Date") = DATE(${appointmentDate})
        `;
        
        if (existingAppointment && existingAppointment.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Patient already has an appointment on this date'
            });
        }

        console.log('=== About to create appointment ===');
        console.log('Specialization being passed to createAppointment:', specialization);
        console.log('Type of specialization:', typeof specialization);
        console.log('Specialization length:', specialization?.length);
        console.log('Specialization trimmed:', specialization?.trim());
        console.log('=====================================');
        
        const result = await appointmentDb.createAppointment({
            patientUsername,
            doctorId,
            appointmentDate,
            timeSlot,
            specialization,
            branch
        });

        res.status(201).json({
            success: true,
            message: 'Appointment booked successfully',
            appointment: result.appointment,
            bill: result.bill
        });
    } catch (error) {
        console.error('Error booking appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to book appointment',
            error: error.message
        });
    }
};

export const rescheduleAppointment = async (req, res) => {
    console.log('Reschedule appointment request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { appointmentId, newDate, newTimeSlot } = req.body;

    try {
        // First, get the current appointment details
        const currentAppointment = await appointmentDb.getAppointmentById(appointmentId);
        
        if (!currentAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        console.log(`Attempting to update appointment ${appointmentId}`);
        console.log('Current date:', currentAppointment.Appointment_Date);
        console.log('New date:', newDate);
        console.log('New time:', newTimeSlot);

        // Format the date as a Date object to ensure proper type
        const dateToUpdate = new Date(newDate);
        console.log('Formatted date object:', dateToUpdate.toISOString());

        // Update the appointment date in Appointment table
        // Use TO_DATE for explicit PostgreSQL date conversion
        const updatedAppointment = await sql`
            UPDATE "Appointment"
            SET "Appointment_Date" = TO_DATE(${newDate}, 'YYYY-MM-DD')
            WHERE "Appointment_ID" = ${appointmentId}
            RETURNING "Appointment_ID", "Patient_ID", "Appointment_Date", "Status", "Type", "Branch_Name"
        `;

        console.log('✅ UPDATE query executed');
        console.log('Rows affected:', updatedAppointment.length);

        if (!updatedAppointment || updatedAppointment.length === 0) {
            throw new Error(`No rows updated for appointment ID: ${appointmentId}. Appointment may not exist.`);
        }

        console.log('✅ Updated record:', JSON.stringify(updatedAppointment[0], null, 2));

        // Verify the update by querying again
        const verifyUpdate = await sql`
            SELECT "Appointment_ID", "Appointment_Date", TO_CHAR("Appointment_Date", 'YYYY-MM-DD') as date_string
            FROM "Appointment"
            WHERE "Appointment_ID" = ${appointmentId}
        `;
        console.log('🔍 Verification query:', JSON.stringify(verifyUpdate[0], null, 2));
        
        const dateMatches = verifyUpdate[0].date_string === newDate;
        console.log(`🔍 Date update successful? ${dateMatches} (expected: ${newDate}, got: ${verifyUpdate[0].date_string})`);

        // Check if Doctor_Appointment record exists for this appointment
        const doctorAppointmentCheck = await sql`
            SELECT "Appointment_ID"
            FROM "Doctor_Appointment"
            WHERE "Appointment_ID" = ${appointmentId}
        `;

        let updatedTime = null;
        if (doctorAppointmentCheck && doctorAppointmentCheck.length > 0) {
            // Update the time in Doctor_Appointment table
            updatedTime = await sql`
                UPDATE "Doctor_Appointment"
                SET "Start_Time" = ${newTimeSlot}
                WHERE "Appointment_ID" = ${appointmentId}
                RETURNING *
            `;
            console.log('✅ Updated appointment time:', updatedTime[0]);
        } else {
            console.log('⚠️ No Doctor_Appointment record found for this appointment. Only date was updated.');
        }

        res.json({
            success: true,
            message: updatedTime 
                ? 'Appointment rescheduled successfully' 
                : 'Appointment date updated successfully (time slot not applicable for this appointment)',
            details: {
                patientUsername: currentAppointment.patient_username,
                previousDate: currentAppointment.appointment_date,
                newDate,
                newTimeSlot: updatedTime ? newTimeSlot : 'N/A'
            },
            appointment: updatedAppointment[0],
            timeUpdate: updatedTime ? updatedTime[0] : null
        });
    } catch (error) {
        console.error('Error rescheduling appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reschedule appointment',
            error: error.message
        });
    }
};

export const cancelAppointment = async (req, res) => {
    console.log('Cancel appointment request body:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log('Validation errors:', errors.array());
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }

    const { appointmentId } = req.body;

    try {
        // First, check if the appointment exists
        const appointment = await appointmentDb.getAppointmentById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Check if the appointment is in the past
        const appointmentDateTime = new Date(`${appointment.appointment_date}T${appointment.time_slot}`);
        const now = new Date();
        
        if (appointmentDateTime < now) {
            return res.status(400).json({
                success: false,
                message: 'Cannot cancel past appointments'
            });
        }

        // Mark appointment as cancelled (retain history)
        const cancelledAppointment = await appointmentDb.cancelAppointment(appointmentId);

        res.json({
            success: true,
            message: 'Appointment cancelled successfully',
            appointment: cancelledAppointment
        });
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to cancel appointment',
            error: error.message
        });
    }
};

export const getAppointmentsByPatient = async (req, res) => {
    const { username } = req.params;

    try {
        const appointments = await appointmentDb.getAppointmentsByPatient(username);

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

export const getAllAppointments = async (req, res) => {
    try {
        const appointments = await appointmentDb.getAllAppointments();

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching all appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

export const getAllBills = async (req, res) => {
    try {
        const bills = await appointmentDb.getAllBills();

        res.json({
            success: true,
            bills
        });
    } catch (error) {
        console.error('Error fetching all bills:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch bills',
            error: error.message
        });
    }
};

export const fetchSpecializations = async (req, res) => {
    try {
        const specializations = await doctorDb.getSpecializations();
        
        console.log('=== Available Specializations in Database ===');
        specializations.forEach(spec => {
            console.log(`ID: ${spec.id}, Name: "${spec.name}"`);
        });
        console.log('==============================================');

        res.json({
            success: true,
            specializations
        });
    } catch (error) {
        console.error('Error fetching specializations:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch specializations',
            error: error.message
        });
    }
};

export const fetchDoctorsBySpecializationAndBranch = async (req, res) => {
    const { specializationId, branch } = req.params;

    try {
        const doctors = await doctorDb.getDoctorsBySpecializationAndBranch(specializationId, branch);

        res.json({
            success: true,
            doctors
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error.message
        });
    }
};

export const fetchAvailableTimeSlots = async (req, res) => {
    const { doctorId, date } = req.params;

    try {
        const availableSlots = await appointmentDb.getAvailableTimeSlots(doctorId, date);

        res.json({
            success: true,
            availableSlots
        });
    } catch (error) {
        console.error('Error fetching available time slots:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch available time slots',
            error: error.message
        });
    }
};

export const getAppointmentById = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointment = await appointmentDb.getAppointmentById(appointmentId);

        res.json({
            success: true,
            appointment
        });
    } catch (error) {
        console.error('Error fetching appointment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointment',
            error: error.message
        });
    }
};

export const getAppointmentsByDate = async (req, res) => {
    const { date } = req.params;

    try {
        const appointments = await appointmentDb.getAppointmentsByDate(date);

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching appointments by date:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

export const getAppointmentsByDoctorAndDate = async (req, res) => {
    const { doctorId, date } = req.params;

    try {
        const appointments = await appointmentDb.getAppointmentsByDoctorAndDate(doctorId, date);

        res.json({
            success: true,
            appointments
        });
    } catch (error) {
        console.error('Error fetching doctor appointments:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch appointments',
            error: error.message
        });
    }
};

export const getPendingInsurances = async (req, res) => {
    try {
        const insurances = await appointmentDb.getPendingInsurances();

        res.json({
            success: true,
            insurances
        });
    } catch (error) {
        console.error('Error fetching pending insurances:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending insurances',
            error: error.message
        });
    }
};

export const updateInsuranceStatus = async (req, res) => {
    const { insuranceId, status } = req.body;

    try {
        const updatedInsurance = await appointmentDb.updateInsuranceStatus(insuranceId, status);

        res.json({
            success: true,
            message: 'Insurance status updated successfully',
            insurance: updatedInsurance
        });
    } catch (error) {
        console.error('Error updating insurance status:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update insurance status',
            error: error.message
        });
    }
};

export const checkInsuranceTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Insurance' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Insurance table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Insurance table structure',
            error: error.message
        });
    }
};

export const checkPatientInsuranceTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Patient_Insurance' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Patient_Insurance table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Patient_Insurance table structure',
            error: error.message
        });
    }
};

export const checkInsuranceClaimTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Insurance_Claim' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Insurance_Claim table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Insurance_Claim table structure',
            error: error.message
        });
    }
};

export const checkBillingTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Billing' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Billing table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Billing table structure',
            error: error.message
        });
    }
};

export const checkSpecializationTableStructure = async (req, res) => {
    try {
        const result = await sql`
            SELECT column_name, data_type 
            FROM information_schema.columns 
            WHERE table_name = 'Specialization' AND table_schema = 'public'
            ORDER BY ordinal_position
        `;
        
        res.json({
            success: true,
            columns: result
        });
    } catch (error) {
        console.error('Error checking Specialization table structure:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check Specialization table structure',
            error: error.message
        });
    }
};

export const getBillingData = async (req, res) => {
    try {
        const result = await sql`
            SELECT 
                b."Bill_ID",
                b."Appointment_ID", 
                b."Total_Amount",
                a."Appointment_Date",
                a."Type" as specialization,
                u.name as patient_name
            FROM "Billing" b
            JOIN "Appointment" a ON b."Appointment_ID" = a."Appointment_ID"
            JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            JOIN "User" u ON p.user_id = u.user_id
            ORDER BY b."Bill_ID" DESC
            LIMIT 10
        `;
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error fetching billing data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch billing data',
            error: error.message
        });
    }
};

export const testBillDetailsWithInsurance = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID is required'
            });
        }
        
        const billDetails = await appointmentDb.getBillDetailsByAppointment(appointmentId);
        
        res.json({
            success: true,
            data: billDetails
        });
    } catch (error) {
        console.error('Error testing bill details with insurance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to test bill details with insurance',
            error: error.message
        });
    }
};

export const demonstrateInsuranceCalculation = async (req, res) => {
    try {
        // Get a sample bill to demonstrate the calculation
        const sampleBill = await sql`
            SELECT 
                b."Bill_ID",
                b."Total_Amount",
                a."Appointment_ID",
                u.name as patient_name
            FROM "Billing" b
            JOIN "Appointment" a ON b."Appointment_ID" = a."Appointment_ID"
            JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            JOIN "User" u ON p.user_id = u.user_id
            ORDER BY b."Bill_ID" DESC
            LIMIT 1
        `;
        
        if (!sampleBill || sampleBill.length === 0) {
            return res.json({
                success: true,
                message: 'No bills found to demonstrate insurance calculation',
                data: null
            });
        }
        
        const bill = sampleBill[0];
        const totalAmount = parseFloat(bill.Total_Amount);
        
        // Simulate different insurance scenarios
        const scenarios = [
            {
                scenario: "No Insurance",
                coveragePercentage: 0,
                insuredAmount: 0,
                amountToBePaid: totalAmount
            },
            {
                scenario: "Basic Insurance (50% Coverage)",
                coveragePercentage: 50,
                insuredAmount: totalAmount * 0.5,
                amountToBePaid: totalAmount * 0.5
            },
            {
                scenario: "Premium Insurance (80% Coverage)",
                coveragePercentage: 80,
                insuredAmount: totalAmount * 0.8,
                amountToBePaid: totalAmount * 0.2
            },
            {
                scenario: "Full Coverage (100% Coverage)",
                coveragePercentage: 100,
                insuredAmount: totalAmount,
                amountToBePaid: 0
            }
        ];
        
        res.json({
            success: true,
            message: 'Insurance calculation demonstration',
            data: {
                sampleBill: bill,
                totalAmount: totalAmount,
                scenarios: scenarios
            }
        });
    } catch (error) {
        console.error('Error demonstrating insurance calculation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to demonstrate insurance calculation',
            error: error.message
        });
    }
};

export const getSpecializationData = async (req, res) => {
    try {
        // Try both table names to see which one exists and has data
        let result = [];
        let tableName = '';
        
        try {
            result = await sql`
                SELECT "Specialization_ID", "Specialization_Name", "Consultation_Fee" 
                FROM "Specialization"
                ORDER BY "Specialization_Name"
            `;
            tableName = 'Specialization';
        } catch (error) {
            console.log('Specialization table not found, trying Specilization...');
            result = await sql`
                SELECT "Specialization_ID", "Specialization_Name", "Consultation_Fee" 
                FROM "Specilization"
                ORDER BY "Specialization_Name"
            `;
            tableName = 'Specilization';
        }
        
        res.json({
            success: true,
            tableName: tableName,
            data: result
        });
    } catch (error) {
        console.error('Error fetching specialization data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch specialization data',
            error: error.message
        });
    }
};

export const testSpecializationFee = async (req, res) => {
    try {
        const { specialization } = req.query;
        
        if (!specialization) {
            return res.status(400).json({
                success: false,
                message: 'Specialization parameter is required'
            });
        }
        
        // Test the getBillAmountBySpecialization function
        const fee = await appointmentDb.getBillAmountBySpecialization(specialization);
        
        res.json({
            success: true,
            specialization: specialization,
            consultationFee: fee,
            message: `Consultation fee for ${specialization}: $${fee}`
        });
    } catch (error) {
        console.error('Error testing specialization fee:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to test specialization fee',
            error: error.message
        });
    }
};

export const getAllInsuranceProviders = async (req, res) => {
    try {
        const insuranceProviders = await appointmentDb.getAllInsuranceProviders();

        res.json({
            success: true,
            message: 'Insurance providers retrieved successfully',
            data: {
                insuranceProviders: insuranceProviders
            }
        });
    } catch (error) {
        console.error('Error fetching insurance providers:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch insurance providers',
            error: error.message
        });
    }
};

export const addPatientInsurance = async (req, res) => {
    try {
        const { patientUsername, insuranceId, policyNumber } = req.body;

        // Validate input
        if (!patientUsername || !insuranceId || !policyNumber) {
            return res.status(400).json({
                success: false,
                message: 'Patient username, insurance ID, and policy number are required'
            });
        }

        const result = await appointmentDb.addPatientInsurance(patientUsername, insuranceId, policyNumber);

        res.json({
            success: true,
            message: 'Patient insurance added successfully',
            data: {
                patientInsurance: result
            }
        });
    } catch (error) {
        console.error('Error adding patient insurance:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add patient insurance',
            error: error.message
        });
    }
};

export const getPatientInsurancesByBillId = async (req, res) => {
    try {
        const { billId } = req.params;

        if (!billId) {
            return res.status(400).json({
                success: false,
                message: 'Bill ID is required'
            });
        }

        const result = await appointmentDb.getPatientInsurancesByBillId(billId);

        res.json({
            success: true,
            message: 'Patient insurances retrieved successfully',
            data: {
                patientId: result.patientId,
                insurances: result.insurances
            }
        });
    } catch (error) {
        console.error('Error fetching patient insurances by bill ID:', error);
        res.status(500).json({
            success: false,
            message: error.message === 'Bill not found' ? 'Bill not found' : 'Failed to fetch patient insurances',
            error: error.message
        });
    }
};

export const submitInsuranceClaim = async (req, res) => {
    const { billId, insuranceId, claimAmount } = req.body;

    // Validate input
    if (!billId || !insuranceId) {
        return res.status(400).json({
            success: false,
            message: 'Bill ID and Insurance ID are required'
        });
    }

    // If claimAmount is provided, validate it
    if (claimAmount && (isNaN(parseFloat(claimAmount)) || parseFloat(claimAmount) <= 0)) {
        return res.status(400).json({
            success: false,
            message: 'Claim Amount must be a positive number'
        });
    }

    try {
        const result = await appointmentDb.submitInsuranceClaim(billId, insuranceId, claimAmount);

        res.json({
            success: true,
            message: 'Insurance claim submitted successfully',
            data: {
                claimId: result.claim.Insurance_Claim_ID,
                billId: result.claim.Bill_ID,
                insuranceId: result.claim.Insurance_ID,
                claimAmount: result.claim.Claim_Amount,
                status: result.claim.Claim_Status,
                originalBillAmount: result.originalAmount,
                insuredAmount: result.insuredAmount
            }
        });
    } catch (error) {
        console.error('Error submitting insurance claim:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit insurance claim',
            error: error.message
        });
    }
};

// Patient registration controllers
export const registerPatient = async (req, res) => {
    const {
        username,
        password,
        name,
        phone,
        dateOfBirth,
        gender,
        address,
        emergencyContact
    } = req.body;

    // Validate required fields
    if (!username || !password || !name || !phone || !dateOfBirth || !gender) {
        return res.status(400).json({
            success: false,
            message: 'Username, password, name, phone, date of birth, and gender are required'
        });
    }

    // Validate phone format (digits with optional formatting)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid phone number'
        });
    }

    try {
        // Check if username already exists
        const usernameExists = await appointmentDb.checkUsernameExists(username);
        if (usernameExists) {
            return res.status(409).json({
                success: false,
                message: 'Username already exists. Please choose a different username.'
            });
        }

        // Register the patient
        const result = await appointmentDb.registerPatient({
            username,
            password,
            name,
            phone,
            dateOfBirth,
            gender,
            address: address || '',
            emergencyContact: emergencyContact || null
        });

        res.status(201).json({
            success: true,
            message: 'Patient registered successfully',
            data: {
                patientId: result.patient.patient_id,
                userId: result.user.user_id,
                username: result.user.username,
                name: result.user.name,
                phone: result.user.phone
            }
        });
    } catch (error) {
        console.error('Error registering patient:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to register patient',
            error: error.message
        });
    }
};

export const checkUsernameAvailability = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).json({
            success: false,
            message: 'Username is required'
        });
    }

    try {
        const exists = await appointmentDb.checkUsernameExists(username);
        
        res.json({
            success: true,
            available: !exists,
            message: exists ? 'Username is already taken' : 'Username is available'
        });
    } catch (error) {
        console.error('Error checking username availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check username availability',
            error: error.message
        });
    }
};

export const checkEmailAvailability = async (req, res) => {
    const { email } = req.params;

    if (!email) {
        return res.status(400).json({
            success: false,
            message: 'Email is required'
        });
    }

    try {
        const exists = await appointmentDb.checkEmailExists(email);
        
        res.json({
            success: true,
            available: !exists,
            message: exists ? 'Email is already registered' : 'Email is available'
        });
    } catch (error) {
        console.error('Error checking email availability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check email availability',
            error: error.message
        });
    }
};


export const getBillDetailsByAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    if (!appointmentId) {
        return res.status(400).json({
            success: false,
            message: 'Appointment ID is required'
        });
    }

    try {
        const result = await appointmentDb.getBillDetailsByAppointment(appointmentId);

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Error getting bill details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get bill details',
            error: error.message
        });
    }
};

// Lab Report Upload Controllers
export const uploadLabReport = async (req, res) => {
    try {
        const { appointmentId, patientUsername, treatmentName } = req.body;

        // Validate required fields
        if (!appointmentId || !patientUsername || !treatmentName) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: appointmentId, patientUsername, treatmentName'
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded. Please select a file to upload.'
            });
        }

        // Get catalogue ID by treatment name
        const catalogue = await appointmentDb.getCatalogueByTreatmentName(treatmentName);
        if (!catalogue) {
            return res.status(400).json({
                success: false,
                message: 'Treatment not found in catalogue'
            });
        }

        // Create file path for database storage
        const reportPath = `/uploads/lab-reports/${req.file.filename}`;
        
        console.log('Uploading file:', {
            originalName: req.file.originalname,
            filename: req.file.filename,
            path: reportPath,
            appointmentId: parseInt(appointmentId),
            catalogueId: catalogue.Catalogue_ID
        });

        // Upload the lab report
        const result = await appointmentDb.uploadLabReport(
            parseInt(appointmentId),
            catalogue.Catalogue_ID,
            reportPath
        );
        
        console.log('Upload result:', result);

        res.status(201).json({
            success: true,
            message: 'Lab report uploaded successfully',
            data: {
                appointmentId: result.Appointment_ID,
                catalogueId: result.Catalogue_ID,
                reportPath: result.Report_Links,
                fileName: req.file.filename,
                originalName: req.file.originalname,
                treatmentName: catalogue.Treatment_name
            }
        });
    } catch (error) {
        console.error('Error uploading lab report:', error);
        res.status(500).json({
            success: false,
            message: 'Error uploading lab report',
            error: error.message
        });
    }
};

export const getLabReports = async (req, res) => {
    try {
        const reports = await appointmentDb.getAllTreatmentAppointments();
        
        res.json({
            success: true,
            message: 'Lab reports retrieved successfully',
            data: reports
        });
    } catch (error) {
        console.error('Error fetching lab reports:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching lab reports',
            error: error.message
        });
    }
};

export const getLabReportByAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID is required'
            });
        }

        const report = await appointmentDb.getTreatmentAppointment(parseInt(appointmentId));
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Lab report not found for this appointment'
            });
        }

        res.json({
            success: true,
            message: 'Lab report retrieved successfully',
            data: report
        });
    } catch (error) {
        console.error('Error fetching lab report:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching lab report',
            error: error.message
        });
    }
};

export const downloadLabReport = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        
        console.log('Download request for appointment ID:', appointmentId);
        
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID is required'
            });
        }

        const report = await appointmentDb.getTreatmentAppointment(parseInt(appointmentId));
        console.log('Retrieved report:', report);
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Lab report not found for this appointment'
            });
        }

        if (!report.Report_Links) {
            return res.status(404).json({
                success: false,
                message: 'No report file found for this appointment'
            });
        }

        // Import path and file system modules
        const path = await import('path');
        const fs = await import('fs');
        const { fileURLToPath } = await import('url');
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        
        // Extract just the filename from the Report_Links path
        const fileName = path.basename(report.Report_Links);
        console.log('Extracted filename:', fileName);
        
        // Construct the full file path
        const filePath = path.join(__dirname, '../../uploads/lab-reports', fileName);
        console.log('Full file path:', filePath);
        
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log('File does not exist at path:', filePath);
            return res.status(404).json({
                success: false,
                message: 'Report file not found on server',
                debug: {
                    reportPath: report.Report_Links,
                    fileName: fileName,
                    fullPath: filePath
                }
            });
        }

        console.log('File exists, proceeding with download');

        // Set appropriate headers for file download
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        
        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
        
        fileStream.on('error', (error) => {
            console.error('Error streaming file:', error);
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'Error downloading file'
                });
            }
        });
        
    } catch (error) {
        console.error('Error downloading lab report:', error);
        res.status(500).json({
            success: false,
            message: 'Error downloading lab report',
            error: error.message
        });
    }
};

export const deleteLabReport = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        
        console.log('Delete request for appointment ID:', appointmentId);
        
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID is required'
            });
        }

        // Get the report first to get the file path
        const report = await appointmentDb.getTreatmentAppointment(parseInt(appointmentId));
        
        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Lab report not found for this appointment'
            });
        }

        // Delete the file from disk if it exists
        if (report.Report_Links && report.Report_Links.startsWith('/uploads/')) {
            try {
                const path = await import('path');
                const fs = await import('fs');
                const { fileURLToPath } = await import('url');
                
                const __filename = fileURLToPath(import.meta.url);
                const __dirname = path.dirname(__filename);
                
                const fileName = path.basename(report.Report_Links);
                const filePath = path.join(__dirname, '../../uploads/lab-reports', fileName);
                
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    console.log('File deleted:', filePath);
                }
            } catch (fileError) {
                console.error('Error deleting file:', fileError);
                // Continue with database deletion even if file deletion fails
            }
        }

        // Delete from database
        await appointmentDb.deleteLabReport(parseInt(appointmentId));

        res.json({
            success: true,
            message: 'Lab report deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting lab report:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting lab report',
            error: error.message
        });
    }
};

// Simple test endpoint for doctor creation (bypasses sequence issues)
export const createDoctorTest = async (req, res) => {
    try {
        const { name, specialization, address, username, password, contact, nic, branch = 'Colombo' } = req.body;
        
        // Validate required fields
        if (!name || !username || !password || !contact || !nic) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, username, password, contact, and NIC are required' 
            });
        }

        // For testing purposes, create a mock response
        const mockDoctor = {
            id: Date.now(), // Use timestamp as unique ID
            name,
            branch,
            user_type: 'doctor',
            specializations: specialization ? [specialization] : ['General Physician']
        };

        res.status(201).json({ 
            success: true, 
            message: 'Doctor created successfully (test mode)',
            data: { doctor: mockDoctor }
        });
    } catch (error) {
        console.error('Error creating doctor (test):', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};

// Update payment amount when generating receipt
export const updatePaymentAmount = async (req, res) => {
    try {
        const { billId, amountPaid } = req.body;

        if (!billId || !amountPaid) {
            return res.status(400).json({
                success: false,
                message: 'Bill ID and amount paid are required'
            });
        }

        // First, get the current bill details
        const billResult = await sql`
            SELECT "Bill_ID", "Total_Amount", "Patient_Amount", "Appointment_ID"
            FROM "Billing"
            WHERE "Bill_ID" = ${billId}
        `;

        if (!billResult || billResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }

        const bill = billResult[0];
        const patientAmount = parseFloat(bill.Patient_Amount || bill.Total_Amount);
        const paidAmount = parseFloat(amountPaid);

        if (paidAmount > patientAmount) {
            return res.status(400).json({
                success: false,
                message: 'Amount paid cannot exceed the patient amount'
            });
        }

        // Calculate total payments made for this bill
        const existingPaymentsResult = await sql`
            SELECT COALESCE(SUM("Amount"), 0) as total_paid
            FROM "Payment"
            WHERE "Bill_ID" = ${billId}
        `;

        const totalPaidSoFar = parseFloat(existingPaymentsResult[0].total_paid);
        const newTotalPaid = totalPaidSoFar + paidAmount;

        // Check if bill is already fully paid
        if (totalPaidSoFar >= patientAmount) {
            return res.status(400).json({
                success: false,
                message: `Bill is already fully paid. Total paid: $${totalPaidSoFar.toFixed(2)}, Patient amount: $${patientAmount.toFixed(2)}`,
                data: {
                    totalPaidSoFar: totalPaidSoFar,
                    patientAmount: patientAmount,
                    remainingAmount: Math.max(0, patientAmount - totalPaidSoFar),
                    isFullyPaid: true
                }
            });
        }

        // Check if this payment would exceed the patient amount
        if (newTotalPaid > patientAmount) {
            const maxAllowedPayment = patientAmount - totalPaidSoFar;
            return res.status(400).json({
                success: false,
                message: `Payment amount ($${paidAmount.toFixed(2)}) would exceed remaining balance. Maximum allowed: $${maxAllowedPayment.toFixed(2)}`,
                data: {
                    totalPaidSoFar: totalPaidSoFar,
                    patientAmount: patientAmount,
                    remainingAmount: maxAllowedPayment,
                    maxAllowedPayment: maxAllowedPayment,
                    attemptedPayment: paidAmount
                }
            });
        }

        // Insert payment record with generated Payment_ID
        const paymentId = parseInt(`${billId}${Date.now().toString().slice(-6)}`);
        const paymentResult = await sql`
            INSERT INTO "Payment" ("Payment_ID", "Bill_ID", "Amount", "Date_Time", "Payment_Method")
            VALUES (${paymentId}, ${billId}, ${paidAmount}, CURRENT_TIMESTAMP, 'Cash')
            RETURNING "Payment_ID", "Amount", "Date_Time"
        `;

        // Update the Patient_Amount in the Billing table by subtracting the amount paid
        const newPatientAmount = patientAmount - paidAmount;
        await sql`
            UPDATE "Billing" 
            SET "Patient_Amount" = ${newPatientAmount}
            WHERE "Bill_ID" = ${billId}
        `;

        const remainingAmount = newPatientAmount;

        // Ensure Status column exists, then update it based on remaining amount
        await sql`
            ALTER TABLE "Billing"
            ADD COLUMN IF NOT EXISTS "Status" VARCHAR(20) DEFAULT 'Pending'
        `;
        const newStatus = remainingAmount <= 0 ? 'Done' : 'Pending';
        await sql`
            UPDATE "Billing"
            SET "Status" = ${newStatus}
            WHERE "Bill_ID" = ${billId}
        `;

        res.json({
            success: true,
            message: 'Payment recorded successfully',
            data: {
                paymentId: paymentResult[0].Payment_ID,
                amountPaid: paymentResult[0].Amount,
                paymentDate: paymentResult[0].Date_Time,
                totalPaidSoFar: newTotalPaid,
                remainingAmount: remainingAmount,
                updatedPatientAmount: newPatientAmount,
                isFullyPaid: remainingAmount <= 0,
                status: newStatus
            }
        });

    } catch (error) {
        console.error('Error recording payment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to record payment',
            error: error.message
        });
    }
};

// Get payment history for a bill
export const getPaymentHistory = async (req, res) => {
    try {
        const { billId } = req.params;

        if (!billId) {
            return res.status(400).json({
                success: false,
                message: 'Bill ID is required'
            });
        }

        // Get payment history for this bill
        const paymentsResult = await sql`
            SELECT 
                p."Payment_ID",
                p."Amount",
                p."Date_Time",
                p."Payment_Method"
            FROM "Payment" p
            WHERE p."Bill_ID" = ${billId}
            ORDER BY p."Date_Time" DESC
        `;

        // Get bill details
        const billResult = await sql`
            SELECT 
                b."Bill_ID",
                b."Total_Amount",
                b."Patient_Amount",
                b."Insured_Amount"
            FROM "Billing" b
            WHERE b."Bill_ID" = ${billId}
        `;

        if (!billResult || billResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found'
            });
        }

        const bill = billResult[0];
        const patientAmount = parseFloat(bill.Patient_Amount || bill.Total_Amount);
        const totalPaid = paymentsResult.reduce((sum, payment) => sum + parseFloat(payment.Amount), 0);
        const remainingAmount = patientAmount - totalPaid;

        res.json({
            success: true,
            data: {
                bill: bill,
                payments: paymentsResult,
                summary: {
                    patientAmount: patientAmount,
                    totalPaid: totalPaid,
                    remainingAmount: remainingAmount,
                    isFullyPaid: remainingAmount <= 0
                }
            }
        });

    } catch (error) {
        console.error('Error fetching payment history:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch payment history',
            error: error.message
        });
    }
};

// Generate bill for appointment
export const generateBill = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: 'Appointment ID is required'
            });
        }

        // Get appointment details with patient and doctor information
        const appointmentResult = await sql`
            SELECT 
                a."Appointment_ID",
                a."Appointment_Date",
                a."Status",
                a."Type",
                a."Branch_Name",
                p.patient_id,
                u.username as patient_username,
                u.name as patient_name,
                u.contact_number as patient_phone,
                u.address as patient_address,
                d."Doctor_ID",
                u_doctor.name as doctor_name,
                da."Start_Time"
            FROM "Appointment" a
            JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            JOIN "User" u ON p.user_id = u.user_id
            LEFT JOIN "Doctor_Appointment" da ON a."Appointment_ID" = da."Appointment_ID"
            LEFT JOIN "Doctor" d ON da."Doctor_ID" = d."Doctor_ID"
            LEFT JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
            LEFT JOIN "User" u_doctor ON s."User_ID" = u_doctor.user_id
            WHERE a."Appointment_ID" = ${appointmentId}
        `;

        if (!appointmentResult || appointmentResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        const appointment = appointmentResult[0];

        // Check if bill already exists; if so, enrich it if missing values
        const existingBillResult = await sql`
            SELECT 
                b."Bill_ID",
                b."Total_Amount",
                b."Insured_Amount",
                b."Patient_Amount",
                b."Insurance_ID",
                b."Due_Date",
                i."Provider_Name" as insurance_provider,
                i."Coverage_Percentage",
                pi."Policy_Number"
            FROM "Billing" b
            LEFT JOIN "Insurance" i ON b."Insurance_ID" = i."Insurance_ID"
            LEFT JOIN "Patient_Insurance" pi ON pi."Insurance_ID" = b."Insurance_ID" AND pi."Patient_ID" = ${appointment.patient_id}
            WHERE b."Appointment_ID" = ${appointmentId}
            ORDER BY b."Bill_ID" DESC
            LIMIT 1
        `;

        if (existingBillResult && existingBillResult.length > 0) {
            let bill = existingBillResult[0];

            // If insurance missing, compute and update now
            const needsInsuranceUpdate = (!bill.Insurance_ID || parseFloat(bill.Insured_Amount || 0) <= 0);
            if (needsInsuranceUpdate) {
                const insuranceResult = await sql`
                    SELECT 
                        pi."Insurance_ID",
                        pi."Policy_Number",
                        pi."Status" as insurance_status,
                        i."Provider_Name",
                        i."Coverage_Percentage"
                    FROM "Patient_Insurance" pi
                    JOIN "Insurance" i ON pi."Insurance_ID" = i."Insurance_ID"
                    WHERE pi."Patient_ID" = ${appointment.patient_id}
                    ORDER BY pi."Insurance_ID" DESC
                    LIMIT 1
                `;

                if (insuranceResult && insuranceResult.length > 0) {
                    const insurance = insuranceResult[0];
                    const coveragePercentage = parseFloat(insurance.Coverage_Percentage) || 0;
                    const insuredAmount = (parseFloat(bill.Total_Amount) * coveragePercentage) / 100;
                    const updatedPatientAmount = parseFloat(bill.Total_Amount) - insuredAmount;

                    await sql`
                        UPDATE "Billing"
                        SET "Insured_Amount" = ${insuredAmount},
                            "Patient_Amount" = ${updatedPatientAmount},
                            "Insurance_ID" = ${insurance.Insurance_ID}
                        WHERE "Bill_ID" = ${bill.Bill_ID}
                    `;

                    const updated = await sql`
                        SELECT 
                            b."Bill_ID",
                            b."Total_Amount",
                            b."Insured_Amount",
                            b."Patient_Amount",
                            b."Insurance_ID",
                            b."Due_Date",
                            i."Provider_Name" as insurance_provider,
                            i."Coverage_Percentage",
                            pi."Policy_Number"
                        FROM "Billing" b
                        LEFT JOIN "Insurance" i ON b."Insurance_ID" = i."Insurance_ID"
                        LEFT JOIN "Patient_Insurance" pi ON pi."Insurance_ID" = b."Insurance_ID" AND pi."Patient_ID" = ${appointment.patient_id}
                        WHERE b."Bill_ID" = ${bill.Bill_ID}
                    `;
                    if (updated && updated.length > 0) {
                        bill = updated[0];
                    }
                }
            }

            // Payment info and status
            const paymentInfoResult = await sql`
                SELECT COALESCE(SUM("Amount"), 0) as total_paid
                FROM "Payment"
                WHERE "Bill_ID" = ${bill.Bill_ID}
            `;
            const totalPaid = parseFloat(paymentInfoResult[0].total_paid);
            const patientAmount = parseFloat(bill.Patient_Amount || bill.Total_Amount);
            const remainingAmount = patientAmount - totalPaid;

            await sql`
                ALTER TABLE "Billing"
                ADD COLUMN IF NOT EXISTS "Status" VARCHAR(20) DEFAULT 'Pending'
            `;
            const billStatus = remainingAmount <= 0 ? 'Done' : 'Pending';
            await sql`
                UPDATE "Billing"
                SET "Status" = ${billStatus}
                WHERE "Bill_ID" = ${bill.Bill_ID}
            `;

            return res.json({
                success: true,
                message: 'Bill already exists for this appointment',
                data: {
                    appointment: appointment,
                    bill: { ...bill, Status: billStatus },
                    paymentInfo: {
                        totalPaid: totalPaid,
                        remainingAmount: remainingAmount,
                        isFullyPaid: remainingAmount <= 0
                    },
                    isNewBill: false
                }
            });
        }

        // Generate new bill
        const specialization = appointment.Type || appointment.Specialization || 'General Medicine';
        const billAmount = await appointmentDb.getBillAmountBySpecialization(specialization);

        // Check for insurance coverage
        let insuredAmount = 0;
        let patientAmount = billAmount;
        let insuranceId = null;
        let insuranceProvider = null;

        const insuranceResult = await sql`
            SELECT 
                pi."Insurance_ID",
                pi."Policy_Number",
                pi."Status" as insurance_status,
                i."Provider_Name",
                i."Coverage_Percentage"
            FROM "Patient_Insurance" pi
            JOIN "Insurance" i ON pi."Insurance_ID" = i."Insurance_ID"
            WHERE pi."Patient_ID" = ${appointment.patient_id}
            ORDER BY pi."Insurance_ID" DESC
            LIMIT 1
        `;

        if (insuranceResult && insuranceResult.length > 0) {
            const insurance = insuranceResult[0];
            const coveragePercentage = parseFloat(insurance.Coverage_Percentage) || 0;
            insuredAmount = (billAmount * coveragePercentage) / 100;
            patientAmount = billAmount - insuredAmount;
            insuranceId = insurance.Insurance_ID;
            insuranceProvider = insurance.Provider_Name;
        }

        // Create the bill
        const billResult = await sql`
            INSERT INTO "Billing" (
                "Appointment_ID", 
                "Total_Amount", 
                "Insured_Amount", 
                "Patient_Amount", 
                "Insurance_ID",
                "Due_Date"
            )
            VALUES (
                ${appointmentId}, 
                ${billAmount}, 
                ${insuredAmount}, 
                ${patientAmount}, 
                ${insuranceId},
                ${appointment.Appointment_Date} + INTERVAL '30 days'
            )
            RETURNING "Bill_ID", "Appointment_ID", "Total_Amount", "Insured_Amount", "Patient_Amount", "Insurance_ID", "Due_Date"
        `;

        const newBill = billResult[0];

        // Get payment information for this bill
        const paymentInfoResult = await sql`
            SELECT COALESCE(SUM("Amount"), 0) as total_paid
            FROM "Payment"
            WHERE "Bill_ID" = ${newBill.Bill_ID}
        `;

        const totalPaid = parseFloat(paymentInfoResult[0].total_paid);
        const billPatientAmount = parseFloat(newBill.Patient_Amount || newBill.Total_Amount);
        const remainingAmount = billPatientAmount - totalPaid;

        // Ensure Status column exists and set it according to remaining amount
        await sql`
            ALTER TABLE "Billing"
            ADD COLUMN IF NOT EXISTS "Status" VARCHAR(20) DEFAULT 'Pending'
        `;
        const billStatus = remainingAmount <= 0 ? 'Done' : 'Pending';
        await sql`
            UPDATE "Billing"
            SET "Status" = ${billStatus}
            WHERE "Bill_ID" = ${newBill.Bill_ID}
        `;

        res.json({
            success: true,
            message: 'Bill generated successfully',
            data: {
                appointment: appointment,
                bill: {
                    ...newBill,
                    insurance_provider: insuranceProvider,
                    coverage_percentage: (insuranceResult && insuranceResult.length > 0) ? insuranceResult[0].Coverage_Percentage : null,
                    policy_number: (insuranceResult && insuranceResult.length > 0) ? insuranceResult[0].Policy_Number : null,
                    Status: billStatus
                },
                paymentInfo: {
                    totalPaid: totalPaid,
                    remainingAmount: remainingAmount,
                    isFullyPaid: remainingAmount <= 0
                },
                isNewBill: true
            }
        });

    } catch (error) {
        console.error('Error generating bill:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate bill',
            error: error.message
        });
    }
};

// Create test insurance data to demonstrate insured amount calculation
export const createTestInsuranceData = async (req, res) => {
    try {
        // First, create an insurance provider (let database handle auto-increment)
        const insuranceResult = await sql`
            INSERT INTO "Insurance" ("Provider_Name", "Coverage_Percentage", "Type")
            VALUES ('Test Insurance Co.', 80, 'Health')
            RETURNING "Insurance_ID", "Provider_Name", "Coverage_Percentage"
        `;

        const insurance = insuranceResult[0];

        // Get a patient to link insurance to
        const patientResult = await sql`
            SELECT p.patient_id, u.username
            FROM "Patient" p
            JOIN "User" u ON p.user_id = u.user_id
            WHERE u.user_type = 'patient'
            LIMIT 1
        `;

        if (!patientResult || patientResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No patients found to link insurance to'
            });
        }

        const patient = patientResult[0];

        // Link patient to insurance
        const patientInsuranceResult = await sql`
            INSERT INTO "Patient_Insurance" ("Patient_ID", "Insurance_ID", "Policy_Number", "Status")
            VALUES (${patient.patient_id}, ${insurance.Insurance_ID}, 'POL-${Date.now()}', 'Active')
            RETURNING "Patient_ID", "Insurance_ID", "Policy_Number", "Status"
        `;

        res.json({
            success: true,
            message: 'Test insurance data created successfully',
            data: {
                insurance: insurance,
                patientInsurance: patientInsuranceResult[0],
                patient: {
                    patient_id: patient.patient_id,
                    username: patient.username
                }
            }
        });

    } catch (error) {
        console.error('Error creating test insurance data:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create test insurance data',
            error: error.message
        });
    }
};

// Test insurance calculation with a specific patient
export const testInsuranceCalculation = async (req, res) => {
    try {
        const { patientUsername } = req.params;
        
        if (!patientUsername) {
            return res.status(400).json({
                success: false,
                message: 'Patient username is required'
            });
        }

        // Get patient ID from username
        const patientResult = await sql`
            SELECT p.patient_id, u.username, u.name
            FROM "Patient" p
            JOIN "User" u ON p.user_id = u.user_id
            WHERE u.username = ${patientUsername}
        `;

        if (!patientResult || patientResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const patient = patientResult[0];

        // Check if patient has insurance
        const insuranceResult = await sql`
            SELECT 
                pi."Patient_ID",
                pi."Insurance_ID",
                pi."Policy_Number",
                pi."Status" as insurance_status,
                i."Provider_Name",
                i."Coverage_Percentage"
            FROM "Patient_Insurance" pi
            JOIN "Insurance" i ON pi."Insurance_ID" = i."Insurance_ID"
            WHERE pi."Patient_ID" = ${patient.patient_id}
            AND pi."Status" = 'Active'
            ORDER BY pi."Insurance_ID" DESC
            LIMIT 1
        `;

        // Get a sample bill for this patient
        const billResult = await sql`
            SELECT 
                b."Bill_ID",
                b."Total_Amount",
                a."Appointment_ID"
            FROM "Billing" b
            JOIN "Appointment" a ON b."Appointment_ID" = a."Appointment_ID"
            WHERE a."Patient_ID" = ${patient.patient_id}
            ORDER BY b."Bill_ID" DESC
            LIMIT 1
        `;

        let insuranceInfo = null;
        let calculation = null;

        if (insuranceResult && insuranceResult.length > 0) {
            insuranceInfo = insuranceResult[0];
            
            if (billResult && billResult.length > 0) {
                const bill = billResult[0];
                const totalAmount = parseFloat(bill.Total_Amount);
                const coveragePercentage = parseFloat(insuranceInfo.Coverage_Percentage) || 0;
                const insuredAmount = (totalAmount * coveragePercentage) / 100;
                const amountToBePaid = totalAmount - insuredAmount;

                calculation = {
                    totalAmount: totalAmount,
                    coveragePercentage: coveragePercentage,
                    insuredAmount: insuredAmount,
                    amountToBePaid: amountToBePaid
                };
            }
        }

        res.json({
            success: true,
            message: 'Insurance calculation test completed',
            data: {
                patient: {
                    patient_id: patient.patient_id,
                    username: patient.username,
                    name: patient.name
                },
                insurance: insuranceInfo,
                sampleBill: billResult.length > 0 ? billResult[0] : null,
                calculation: calculation
            }
        });

    } catch (error) {
        console.error('Error testing insurance calculation:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to test insurance calculation',
            error: error.message
        });
    }
};

// Debug endpoint to check all insurance data for a patient
export const debugPatientInsurance = async (req, res) => {
    try {
        const { patientUsername } = req.params;
        
        if (!patientUsername) {
            return res.status(400).json({
                success: false,
                message: 'Patient username is required'
            });
        }

        // Get patient ID from username
        const patientResult = await sql`
            SELECT p.patient_id, u.username, u.name
            FROM "Patient" p
            JOIN "User" u ON p.user_id = u.user_id
            WHERE u.username = ${patientUsername}
        `;

        if (!patientResult || patientResult.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Patient not found'
            });
        }

        const patient = patientResult[0];

        // Check ALL insurance records for this patient (not just Active)
        const allInsuranceResult = await sql`
            SELECT 
                pi."Patient_ID",
                pi."Insurance_ID",
                pi."Policy_Number",
                pi."Status" as insurance_status,
                i."Provider_Name",
                i."Coverage_Percentage"
            FROM "Patient_Insurance" pi
            JOIN "Insurance" i ON pi."Insurance_ID" = i."Insurance_ID"
            WHERE pi."Patient_ID" = ${patient.patient_id}
            ORDER BY pi."Insurance_ID" DESC
        `;

        // Check if there are any insurance records at all
        const allInsuranceRecords = await sql`
            SELECT * FROM "Patient_Insurance" WHERE "Patient_ID" = ${patient.patient_id}
        `;

        // Check if there are any insurance providers
        const allInsuranceProviders = await sql`
            SELECT * FROM "Insurance" LIMIT 5
        `;

        res.json({
            success: true,
            message: 'Debug insurance data completed',
            data: {
                patient: {
                    patient_id: patient.patient_id,
                    username: patient.username,
                    name: patient.name
                },
                allInsuranceRecords: allInsuranceRecords,
                allInsuranceProviders: allInsuranceProviders,
                joinedInsuranceData: allInsuranceResult,
                debugInfo: {
                    patientId: patient.patient_id,
                    totalInsuranceRecords: allInsuranceRecords.length,
                    totalProviders: allInsuranceProviders.length,
                    joinedRecords: allInsuranceResult.length
                }
            }
        });

    } catch (error) {
        console.error('Error debugging patient insurance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to debug patient insurance',
            error: error.message
        });
    }
};

// Add insured amount column to billing table
export const addInsuredAmountColumn = async (req, res) => {
    try {
        // Add Insured_Amount column
        await sql`
            ALTER TABLE "Billing" 
            ADD COLUMN IF NOT EXISTS "Insured_Amount" DECIMAL(10,2) DEFAULT 0.00
        `;

        // Add Amount_To_Be_Paid column
        await sql`
            ALTER TABLE "Billing" 
            ADD COLUMN IF NOT EXISTS "Amount_To_Be_Paid" DECIMAL(10,2) DEFAULT 0.00
        `;

        // Add Insurance_ID column to link to insurance
        await sql`
            ALTER TABLE "Billing" 
            ADD COLUMN IF NOT EXISTS "Insurance_ID" INTEGER
        `;

        res.json({
            success: true,
            message: 'Insured amount columns added to billing table',
            data: {
                addedColumns: ['Insured_Amount', 'Amount_To_Be_Paid', 'Insurance_ID']
            }
        });

    } catch (error) {
        console.error('Error adding insured amount column:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add insured amount column',
            error: error.message
        });
    }
};

// Add insurance provider
export const addInsuranceProvider = async (req, res) => {
    try {
        const { providerName, coveragePercentage } = req.body;

        // Validate input
        if (!providerName || !coveragePercentage) {
            return res.status(400).json({
                success: false,
                message: 'Provider name and coverage percentage are required'
            });
        }

        // Validate coverage percentage
        const coverage = parseFloat(coveragePercentage);
        if (isNaN(coverage) || coverage < 0 || coverage > 100) {
            return res.status(400).json({
                success: false,
                message: 'Coverage percentage must be a number between 0 and 100'
            });
        }

        // Check if provider already exists
        const existingProvider = await sql`
            SELECT "Insurance_ID" 
            FROM "Insurance" 
            WHERE "Provider_Name" = ${providerName}
        `;

        if (existingProvider && existingProvider.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Insurance provider with this name already exists'
            });
        }

        // Insert new insurance provider with manual ID generation if needed
        let result;
        try {
            // Try inserting without specifying Insurance_ID (for auto-increment)
            result = await sql`
                INSERT INTO "Insurance" ("Provider_Name", "Coverage_Percentage", "Type")
                VALUES (${providerName}, ${coverage}, 'Health')
                RETURNING "Insurance_ID", "Provider_Name", "Coverage_Percentage", "Type"
            `;
        } catch (error) {
            // If auto-increment fails, generate a manual ID
            if (error.code === '23502' && error.column === 'Insurance_ID') {
                const maxIdResult = await sql`
                    SELECT COALESCE(MAX("Insurance_ID"), 0) + 1 as next_id
                    FROM "Insurance"
                `;
                const nextId = maxIdResult[0].next_id;
                
                result = await sql`
                    INSERT INTO "Insurance" ("Insurance_ID", "Provider_Name", "Coverage_Percentage", "Type")
                    VALUES (${nextId}, ${providerName}, ${coverage}, 'Health')
                    RETURNING "Insurance_ID", "Provider_Name", "Coverage_Percentage", "Type"
                `;
            } else {
                throw error;
            }
        }

        res.json({
            success: true,
            message: 'Insurance provider added successfully',
            data: {
                insurance: result[0]
            }
        });

    } catch (error) {
        console.error('Error adding insurance provider:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add insurance provider',
            error: error.message
        });
    }
};

// Fix Insurance table schema to make Insurance_ID auto-increment
export const fixInsuranceTableSchema = async (req, res) => {
    try {
        // First, check if the table exists and get its current structure
        const tableCheck = await sql`
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'Insurance'
            )
        `;

        if (!tableCheck[0].exists) {
            // Create the Insurance table if it doesn't exist
            await sql`
                CREATE TABLE "Insurance" (
                    "Insurance_ID" SERIAL PRIMARY KEY,
                    "Provider_Name" VARCHAR(255) NOT NULL UNIQUE,
                    "Coverage_Percentage" DECIMAL(5,2) NOT NULL CHECK ("Coverage_Percentage" >= 0 AND "Coverage_Percentage" <= 100),
                    "Type" VARCHAR(50) DEFAULT 'Health',
                    "Created_At" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    "Updated_At" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `;

            res.json({
                success: true,
                message: 'Insurance table created successfully with proper schema',
                action: 'created'
            });
        } else {
            // Check if Insurance_ID is already SERIAL
            const columnInfo = await sql`
                SELECT column_name, data_type, is_nullable, column_default
                FROM information_schema.columns 
                WHERE table_name = 'Insurance' AND table_schema = 'public'
                AND column_name = 'Insurance_ID'
            `;

            if (columnInfo.length === 0) {
                // Add Insurance_ID column as SERIAL PRIMARY KEY
                await sql`
                    ALTER TABLE "Insurance" 
                    ADD COLUMN "Insurance_ID" SERIAL PRIMARY KEY
                `;
                res.json({
                    success: true,
                    message: 'Insurance_ID column added as SERIAL PRIMARY KEY',
                    action: 'added_column'
                });
            } else if (!columnInfo[0].column_default || !columnInfo[0].column_default.includes('nextval')) {
                // Modify existing column to be SERIAL
                await sql`
                    ALTER TABLE "Insurance" 
                    ALTER COLUMN "Insurance_ID" SET DEFAULT nextval('"Insurance_Insurance_ID_seq"'::regclass)
                `;
                res.json({
                    success: true,
                    message: 'Insurance_ID column updated to auto-increment',
                    action: 'updated_column'
                });
            } else {
                res.json({
                    success: true,
                    message: 'Insurance table schema is already correct',
                    action: 'no_change_needed'
                });
            }
        }

    } catch (error) {
        console.error('Error fixing Insurance table schema:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fix Insurance table schema',
            error: error.message
        });
    }
};

// Add Status column to Patient_Insurance table if it doesn't exist
export const addPatientInsuranceStatusColumn = async (req, res) => {
    try {
        // Check if Status column exists
        const columnCheck = await sql`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'Patient_Insurance' 
            AND table_schema = 'public'
            AND column_name = 'Status'
        `;

        if (columnCheck.length === 0) {
            // Column doesn't exist, add it
            await sql`
                ALTER TABLE "Patient_Insurance"
                ADD COLUMN "Status" VARCHAR(20) DEFAULT 'Approved'
            `;
            
            res.json({
                success: true,
                message: 'Status column added to Patient_Insurance table successfully',
                action: 'added_column'
            });
        } else {
            res.json({
                success: true,
                message: 'Status column already exists in Patient_Insurance table',
                action: 'no_change_needed'
            });
        }
    } catch (error) {
        console.error('Error adding Status column to Patient_Insurance:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add Status column to Patient_Insurance table',
            error: error.message
        });
    }
};