import { sql } from '../db_utils/db.js';
import * as appointmentDb from '../db_utils/appointment.js';
import * as doctorDb from '../db_utils/doctor.js';
import { validationResult } from 'express-validator';

// Test database connection
export const testDatabaseConnection = async (req, res) => {
    try {
        const result = await sql`SELECT 1 as test`;
        res.json({
            success: true,
            message: 'Database connection successful',
            result: result[0]
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    }
};

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
                u.user_type
            FROM "Doctor" d
            JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
            JOIN "User" u ON s."User_ID" = u.user_id
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

// Get all doctors for testing
export const getAllStaff = async (req, res) => {
    try {
        const result = await sql`
            SELECT 
                s."Staff_ID" as id, 
                u.name, 
                s."Branch_Name" as branch,
                u.user_type
            FROM "Staff" d
            JOIN "User" u ON s."User_ID" = u.user_id
            ORDER BY s."Staff_ID"
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

// Create a new staff member
export const createStaff = async (req, res) => {
    try {
        const { name, role, address, username, password, contact, email, nic, branch = 'Colombo' } = req.body;
        
        // Validate required fields
        if (!name || !role || !username || !password || !contact || !email || !nic) {
            return res.status(400).json({ 
                success: false, 
                message: 'Name, role, username, password, contact, email, and NIC are required' 
            });
        }

        // Validate role
        if (!['receptionist', 'lab-assistant'].includes(role)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Role must be either "receptionist" or "lab-assistant"' 
            });
        }

        // Start transaction
        const result = await sql.begin(async sql => {
            // 1. Create user first
            const userResult = await sql`
                INSERT INTO "User" (name, nic, contact_number, email, address, username, password_hash, user_type)
                VALUES (${name}, ${nic}, ${contact}, ${email}, ${address}, ${username}, ${password}, ${role})
                RETURNING user_id
            `;
            
            const userId = userResult[0].user_id;

            // 2. Create staff record
            const staffResult = await sql`
                INSERT INTO "Staff" ("User_ID", "Branch_Name")
                VALUES (${userId}, ${branch})
                RETURNING "Staff_ID"
            `;
            
            const staffId = staffResult[0].Staff_ID;

            return { userId, staffId };
        });

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

    const { appointmentId, newDate } = req.body;

    try {
        // First, get the current appointment details
        const currentAppointment = await appointmentDb.getAppointmentById(appointmentId);
        
        if (!currentAppointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found'
            });
        }

        // Update only the appointment date (time is not stored in Appointment table)
        const updatedAppointment = await appointmentDb.updateAppointment(
            appointmentId,
            { appointment_date: newDate }
        );

        res.json({
            success: true,
            message: 'Appointment rescheduled successfully',
            details: {
                patientUsername: currentAppointment.patient_username,
                previousDate: currentAppointment.appointment_date,
                newDate
            },
            appointment: updatedAppointment
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

export const submitInsuranceClaim = async (req, res) => {
    const { billId, insuranceId, claimAmount } = req.body;

    // Validate input
    if (!billId || !insuranceId || !claimAmount) {
        return res.status(400).json({
            success: false,
            message: 'Bill ID, Insurance ID, and Claim Amount are required'
        });
    }

    if (isNaN(parseFloat(claimAmount)) || parseFloat(claimAmount) <= 0) {
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
                newBillAmount: result.newAmount
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
        address
    } = req.body;

    // Validate required fields
    if (!username || !password || !name || !phone || !dateOfBirth || !gender) {
        return res.status(400).json({
            success: false,
            message: 'Username, password, name, phone, date of birth, and gender are required'
        });
    }

    // Validate phone format (more lenient validation)
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid phone number (7-20 characters)'
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
            address: address || ''
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