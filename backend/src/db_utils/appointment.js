import { sql } from './db.js';

// Helper function to get bill amount from Specialization table
const getBillAmountBySpecialization = async (specialization) => {
    try {
        const result = await sql`
            SELECT "Consultation_Fee" 
            FROM "Specialization" 
            WHERE "Specialization_Name" = ${specialization}
        `;
        
        if (result && result.length > 0) {
            const consultationFee = result[0].Consultation_Fee;
            console.log(`Found consultation fee for ${specialization}: $${consultationFee}`);
            return parseFloat(consultationFee) || 100.00;
        }
        
        console.log(`No specialization found for: ${specialization}, using default $100.00`);
        return 100.00; // Default amount if specialization not found
    } catch (error) {
        console.error('Error fetching specialization consultation fee:', error);
        return 100.00; // Default amount on error
    }
};

export const createAppointment = async (appointmentData) => {
    const {
        patientUsername,
        doctorId,
        appointmentDate,
        timeSlot,
        specialization,
        branch
    } = appointmentData;

    // First, get the patient ID from the username
    const patientResult = await sql`
        SELECT p.patient_id 
        FROM "Patient" p
        JOIN "User" u ON p.user_id = u.user_id
        WHERE u.username = ${patientUsername}
    `;
    
    if (!patientResult || patientResult.length === 0) {
        throw new Error('Patient not found');
    }
    
    const patientId = patientResult[0].patient_id;

    // Ensure Type fits into varchar(10) per schema
    const typeValue = (specialization ?? '').toString().slice(0, 10);

    const result = await sql`
        INSERT INTO "Appointment" (
            "Patient_ID",
            "Appointment_Date",
            "Status",
            "Type",
            "Branch_Name"
        )
        VALUES (
            ${patientId},
            ${appointmentDate},
            'Scheduled',
            ${typeValue},
            ${branch}
        )
        RETURNING *
    `;

    const appointment = result[0];

    // Auto-generate bill based on appointment type/specialization
    const billAmount = await getBillAmountBySpecialization(specialization);
    
    // Generate a unique numeric Bill_ID based on appointment ID and timestamp
    const billId = parseInt(`${appointment.Appointment_ID}${Date.now().toString().slice(-6)}`);
    
    const billResult = await sql`
        INSERT INTO "Billing" ("Bill_ID", "Appointment_ID", "Total_Amount")
        VALUES (${billId}, ${appointment.Appointment_ID}, ${billAmount})
        RETURNING "Bill_ID", "Appointment_ID", "Total_Amount"
    `;

    return {
        appointment: appointment,
        bill: billResult[0]
    };
};

export const updateAppointment = async (appointmentId, updates) => {
    const validFields = ['appointment_date', 'time_slot', 'status'];
    const updateFields = {};

    for (const key of Object.keys(updates)) {
        if (validFields.includes(key)) {
            updateFields[key] = updates[key];
        }
    }

    if (Object.keys(updateFields).length === 0) {
        throw new Error('No valid fields to update');
    }

    // Handle different update scenarios
    if (updateFields.appointment_date && updateFields.time_slot) {
        const result = await sql`
            UPDATE "Appointment"
            SET "Appointment_Date" = ${updateFields.appointment_date}, "Time_Slot" = ${updateFields.time_slot}
            WHERE "Appointment_ID" = ${appointmentId}
            RETURNING *
        `;
        return result[0];
    } else if (updateFields.appointment_date) {
        const result = await sql`
            UPDATE "Appointment"
            SET "Appointment_Date" = ${updateFields.appointment_date}
            WHERE "Appointment_ID" = ${appointmentId}
            RETURNING *
        `;
        return result[0];
    } else if (updateFields.time_slot) {
        const result = await sql`
            UPDATE "Appointment"
            SET "Time_Slot" = ${updateFields.time_slot}
            WHERE "Appointment_ID" = ${appointmentId}
            RETURNING *
        `;
        return result[0];
    } else if (updateFields.status) {
        const result = await sql`
            UPDATE "Appointment"
            SET "Status" = ${updateFields.status}
            WHERE "Appointment_ID" = ${appointmentId}
            RETURNING *
        `;
        return result[0];
    }

    throw new Error('No valid fields to update');
};

export const deleteAppointment = async (appointmentId) => {
    const result = await sql`
        DELETE FROM "Appointment" 
        WHERE "Appointment_ID" = ${appointmentId}
        RETURNING *
    `;
    
    if (!result || result.length === 0) {
        throw new Error('Appointment not found');
    }
    
    return result[0];
};

export const getAppointmentById = async (appointmentId) => {
    const result = await sql`
        SELECT 
            a.*,
            u.name as patient_name,
            u.contact_number as patient_contact
        FROM "Appointment" a
        JOIN "Patient" p ON a."Patient_ID" = p.patient_id
        JOIN "User" u ON p.user_id = u.user_id
        WHERE a."Appointment_ID" = ${appointmentId}
    `;
    
    if (!result || result.length === 0) {
        throw new Error('Appointment not found');
    }
    
    return result[0];
};

export const getAppointmentsByDate = async (date) => {
    const result = await sql`
        SELECT 
            a.*,
            u.name as patient_name,
            u.contact_number as patient_contact
        FROM "Appointment" a
        JOIN "Patient" p ON a."Patient_ID" = p.patient_id
        JOIN "User" u ON p.user_id = u.user_id
        WHERE a."Appointment_Date" = ${date}
        ORDER BY a."Time_Slot"
    `;
    
    return result;
};

export const getAppointmentsByDoctorAndDate = async (doctorId, date) => {
    // Schema does not contain Doctor reference; return appointments by date only
    const result = await sql`
        SELECT 
            a.*,
            u.name as patient_name,
            u.contact_number as patient_contact
        FROM "Appointment" a
        JOIN "Patient" p ON a."Patient_ID" = p.patient_id
        JOIN "User" u ON p.user_id = u.user_id
        WHERE a."Appointment_Date" = ${date}
        ORDER BY a."Appointment_Date"
    `;
    
    return result;
};

export const getAppointmentsByPatient = async (patientUsername) => {
    const result = await sql`
        SELECT 
            a.*
        FROM "Appointment" a
        JOIN "Patient" p ON a."Patient_ID" = p.patient_id
        JOIN "User" u ON p.user_id = u.user_id
        WHERE u.username = ${patientUsername}
        ORDER BY a."Appointment_Date", a."Time_Slot"
    `;
    
    return result;
};

export const getAllAppointments = async () => {
    const result = await sql`
        SELECT 
            a.*,
            u.name as patient_name
        FROM "Appointment" a
        JOIN "Patient" p ON a."Patient_ID" = p.patient_id
        JOIN "User" u ON p.user_id = u.user_id
        ORDER BY a."Appointment_Date"
    `;
    
    return result;
};

export const getAllBills = async () => {
    const result = await sql`
        SELECT 
            b."Bill_ID" as bill_id,
            b."Total_Amount" as total_amount,
            a."Appointment_ID" as appointment_id,
            a."Appointment_Date" as appointment_date,
            u.name as patient_name
        FROM "Billing" b
        JOIN "Appointment" a ON b."Appointment_ID" = a."Appointment_ID"
        JOIN "Patient" p ON a."Patient_ID" = p.patient_id
        JOIN "User" u ON p.user_id = u.user_id
        ORDER BY a."Appointment_Date" DESC
    `;
    return result;
};

export const getAvailableTimeSlots = async (doctorId, date) => {
    // For now, return a simple list of available time slots
    // Since the Appointment table doesn't have Time_Slot, we'll return all slots
    
    // Generate all possible time slots (9 AM to 5 PM)
    const timeSlots = [
        "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
    ];

    return timeSlots;
};

export const cancelAppointment = async (appointmentId) => {
    const result = await sql`
        UPDATE "Appointment"
        SET "Status" = 'Cancelled'
        WHERE "Appointment_ID" = ${appointmentId}
        RETURNING *
    `;

    if (!result || result.length === 0) {
        throw new Error('Appointment not found');
    }

    return result[0];
};

export const getPendingInsurances = async () => {
    // Using Insurance_Claim table which has Claim_Status column
    const result = await sql`
        SELECT 
            ic."Insurance_Claim_ID" as insurance_id,
            u.username as patient_username,
            COALESCE(ic."Claim_Status", 'Pending') as status
        FROM "Insurance_Claim" ic
        JOIN "Patient_Insurance" pi ON ic."Insurance_ID" = pi."Insurance_ID"
        JOIN "Patient" p ON pi."Patient_ID" = p.patient_id
        JOIN "User" u ON p.user_id = u.user_id
        WHERE ic."Claim_Status" = 'Pending' OR ic."Claim_Status" IS NULL
        ORDER BY ic."Insurance_Claim_ID"
    `;
    
    return result;
};

export const updateInsuranceStatus = async (insuranceId, status) => {
    // Update the Claim_Status in Insurance_Claim table
    try {
        // First, check if the record exists
        const checkResult = await sql`
            SELECT ic."Insurance_Claim_ID"
            FROM "Insurance_Claim" ic
            WHERE ic."Insurance_Claim_ID" = ${insuranceId}
        `;

        if (!checkResult || checkResult.length === 0) {
            throw new Error('Insurance claim record not found');
        }

        // Update the claim status
        const result = await sql`
            UPDATE "Insurance_Claim"
            SET "Claim_Status" = ${status}
            WHERE "Insurance_Claim_ID" = ${insuranceId}
            RETURNING 
                "Insurance_Claim_ID" as insurance_id,
                "Claim_Status" as status
        `;

        // Get the updated record with patient username
        const updatedRecord = await sql`
            SELECT 
                ic."Insurance_Claim_ID" as insurance_id,
                u.username as patient_username,
                ic."Claim_Status" as status
            FROM "Insurance_Claim" ic
            JOIN "Patient_Insurance" pi ON ic."Insurance_ID" = pi."Insurance_ID"
            JOIN "Patient" p ON pi."Patient_ID" = p.patient_id
            JOIN "User" u ON p.user_id = u.user_id
            WHERE ic."Insurance_Claim_ID" = ${insuranceId}
        `;

        return updatedRecord[0];
    } catch (error) {
        console.error('Error updating insurance claim status:', error);
        throw error;
    }
};

export const submitInsuranceClaim = async (billId, insuranceId, claimAmount) => {
    try {
        // First, check if the bill exists
        const billCheck = await sql`
            SELECT "Bill_ID", "Total_Amount", "Patient_ID"
            FROM "Billing"
            WHERE "Bill_ID" = ${billId}
        `;

        if (!billCheck || billCheck.length === 0) {
            throw new Error('Bill not found');
        }

        const bill = billCheck[0];

        // Check if the insurance exists
        const insuranceCheck = await sql`
            SELECT "Insurance_ID"
            FROM "Insurance"
            WHERE "Insurance_ID" = ${insuranceId}
        `;

        if (!insuranceCheck || insuranceCheck.length === 0) {
            throw new Error('Insurance not found');
        }

        // Create the insurance claim
        const claimResult = await sql`
            INSERT INTO "Insurance_Claim" ("Bill_ID", "Insurance_ID", "Claim_Amount", "Claim_Status", "Submitted_Date")
            VALUES (${billId}, ${insuranceId}, ${claimAmount}, 'Pending', CURRENT_DATE)
            RETURNING "Insurance_Claim_ID", "Bill_ID", "Insurance_ID", "Claim_Amount", "Claim_Status"
        `;

        // Update the billing table - reduce the total amount by the claim amount
        const newTotalAmount = parseFloat(bill.Total_Amount) - parseFloat(claimAmount);
        
        const billingUpdate = await sql`
            UPDATE "Billing"
            SET "Total_Amount" = ${newTotalAmount}
            WHERE "Bill_ID" = ${billId}
            RETURNING "Bill_ID", "Total_Amount"
        `;

        return {
            claim: claimResult[0],
            billing: billingUpdate[0],
            originalAmount: bill.Total_Amount,
            newAmount: newTotalAmount
        };
    } catch (error) {
        console.error('Error submitting insurance claim:', error);
        throw error;
    }
};

// Patient registration functions
export const registerPatient = async (patientData) => {
    const {
        username,
        password,
        name,
        phone,
        dateOfBirth,
        gender,
        address
    } = patientData;

    try {
        // Create the User record first
        const userResult = await sql`
            INSERT INTO "User" (username, password_hash, name, contact_number, user_type)
            VALUES (${username}, ${password}, ${name}, ${phone}, 'patient')
            RETURNING user_id, username, name, contact_number
        `;

        if (!userResult || userResult.length === 0) {
            throw new Error('Failed to create user record');
        }

        const user = userResult[0];

        // Then, create the Patient record
        const patientResult = await sql`
            INSERT INTO "Patient" (
                user_id, 
                date_of_birth, 
                gender, 
                emergency_contact
            )
            VALUES (
                ${user.user_id},
                ${dateOfBirth},
                ${gender},
                ${address || ''}
            )
            RETURNING patient_id, user_id, date_of_birth, gender
        `;

        if (!patientResult || patientResult.length === 0) {
            throw new Error('Failed to create patient record');
        }

        const patient = patientResult[0];

        return {
            user: {
                user_id: user.user_id,
                username: user.username,
                name: user.name,
                phone: user.contact_number
            },
            patient: {
                patient_id: patient.patient_id,
                user_id: patient.user_id,
                date_of_birth: patient.date_of_birth,
                gender: patient.gender
            }
        };
    } catch (error) {
        console.error('Error registering patient:', error);
        throw error;
    }
};

export const checkUsernameExists = async (username) => {
    try {
        const result = await sql`
            SELECT user_id, username 
            FROM "User" 
            WHERE username = ${username}
        `;
        
        return result && result.length > 0;
    } catch (error) {
        console.error('Error checking username:', error);
        throw error;
    }
};

export const checkEmailExists = async (email) => {
    try {
        const result = await sql`
            SELECT user_id, email 
            FROM "User" 
            WHERE email = ${email}
        `;
        
        return result && result.length > 0;
    } catch (error) {
        console.error('Error checking email:', error);
        return false; // Return false on error to allow registration
    }
};

export const getAllPatients = async () => {
    try {
        const result = await sql`
            SELECT 
                p.patient_id,
                u.username,
                u.name,
                u.email,
                u.contact_number,
                p.date_of_birth,
                p.gender,
                p.emergency_contact
            FROM "Patient" p
            JOIN "User" u ON p.user_id = u.user_id
            ORDER BY p.patient_id DESC
        `;
        
        return result;
    } catch (error) {
        console.error('Error fetching all patients:', error);
        throw error;
    }
};

// Treatment Appointment functions for lab reports
export const uploadLabReport = async (appointmentId, catalogueId, reportLink) => {
    try {
        // Check if appointment exists
        const appointmentExists = await sql`
            SELECT "Appointment_ID" 
            FROM "Appointment" 
            WHERE "Appointment_ID" = ${appointmentId}
        `;
        
        if (!appointmentExists || appointmentExists.length === 0) {
            throw new Error('Appointment not found');
        }

        // Check if catalogue exists
        const catalogueExists = await sql`
            SELECT "Catalogue_ID" 
            FROM "Catalogue" 
            WHERE "Catalogue_ID" = ${catalogueId}
        `;
        
        if (!catalogueExists || catalogueExists.length === 0) {
            throw new Error('Treatment catalogue not found');
        }

        // Insert or update treatment appointment record
        const result = await sql`
            INSERT INTO "Treatment_Appointment" (
                "Appointment_ID", 
                "Catalogue_ID", 
                "Report_Links"
            )
            VALUES (
                ${appointmentId},
                ${catalogueId},
                ${reportLink}
            )
            ON CONFLICT ("Appointment_ID") 
            DO UPDATE SET 
                "Catalogue_ID" = EXCLUDED."Catalogue_ID",
                "Report_Links" = EXCLUDED."Report_Links"
            RETURNING "Appointment_ID", "Catalogue_ID", "Report_Links"
        `;

        return result[0];
    } catch (error) {
        console.error('Error uploading lab report:', error);
        throw error;
    }
};

export const getTreatmentAppointment = async (appointmentId) => {
    try {
        const result = await sql`
            SELECT 
                ta."Appointment_ID",
                ta."Catalogue_ID",
                ta."Report_Links",
                c."Treatment_name",
                a."Patient_ID",
                u.username as patient_username,
                u.name as patient_name
            FROM "Treatment_Appointment" ta
            JOIN "Catalogue" c ON ta."Catalogue_ID" = c."Catalogue_ID"
            JOIN "Appointment" a ON ta."Appointment_ID" = a."Appointment_ID"
            JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            JOIN "User" u ON p.user_id = u.user_id
            WHERE ta."Appointment_ID" = ${appointmentId}
        `;
        
        return result[0] || null;
    } catch (error) {
        console.error('Error fetching treatment appointment:', error);
        throw error;
    }
};

export const getAllTreatmentAppointments = async () => {
    try {
        const result = await sql`
            SELECT 
                ta."Appointment_ID",
                ta."Catalogue_ID",
                ta."Report_Links",
                c."Treatment_name",
                a."Patient_ID",
                a."Appointment_Date",
                u.username as patient_username,
                u.name as patient_name
            FROM "Treatment_Appointment" ta
            JOIN "Catalogue" c ON ta."Catalogue_ID" = c."Catalogue_ID"
            JOIN "Appointment" a ON ta."Appointment_ID" = a."Appointment_ID"
            JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            JOIN "User" u ON p.user_id = u.user_id
            ORDER BY ta."Appointment_ID" DESC
        `;
        
        return result;
    } catch (error) {
        console.error('Error fetching all treatment appointments:', error);
        throw error;
    }
};

export const getCatalogueByTreatmentName = async (treatmentName) => {
    try {
        const result = await sql`
            SELECT "Catalogue_ID", "Treatment_name", "Price"
            FROM "Catalogue"
            WHERE "Treatment_name" = ${treatmentName}
        `;
        
        return result[0] || null;
    } catch (error) {
        console.error('Error fetching catalogue by treatment name:', error);
        throw error;
    }
};

export const getBillDetailsByAppointment = async (appointmentId) => {
    try {
        // Get appointment with all details from database
        const appointmentResult = await sql`
            SELECT 
                a."Appointment_ID",
                a."Appointment_Date",
                a."Type" as specialization,
                a."Branch_Name" as branch_name,
                u_patient.username as patient_username,
                u_patient.name as patient_name,
                '10:00 AM' as time_slot
            FROM "Appointment" a
            JOIN "Patient" p ON a."Patient_ID" = p.patient_id
            JOIN "User" u_patient ON p.user_id = u_patient.user_id
            WHERE a."Appointment_ID" = ${appointmentId}
        `;

        if (!appointmentResult || appointmentResult.length === 0) {
            throw new Error('Appointment not found');
        }

        const appointment = appointmentResult[0];
        
        // Data is correct - appointment details fetched from database

        // Try to find a doctor for this specialization
        let doctorName = 'Dr. Available';
        try {
            // First check what columns exist in Doctor table
            const doctorColumns = await sql`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'Doctor'
            `;
            console.log('Doctor table columns:', doctorColumns.map(c => c.column_name));
            
            // Try to find any available doctor (simplified approach)
            const doctorResult = await sql`
                SELECT u_doctor.name as doctor_name
                FROM "Doctor" d
                JOIN "Staff" s ON d."Staff_ID" = s."Staff_ID"
                JOIN "User" u_doctor ON s."User_ID" = u_doctor.user_id
                LIMIT 1
            `;
            
            if (doctorResult && doctorResult.length > 0) {
                doctorName = doctorResult[0].doctor_name;
                console.log(`Found doctor: ${doctorName}`);
            } else {
                console.log(`No doctors found in database`);
            }
        } catch (error) {
            console.log('Error finding doctor:', error.message);
        }

        // Add doctor name to appointment data
        appointment.doctor_name = doctorName;

        // Get the consultation fee from Specialization table
        let consultationFee = 100.00; // Default
        try {
            const feeResult = await sql`
                SELECT "Consultation_Fee" 
                FROM "Specialization" 
                WHERE "Specialization_Name" = ${appointment.specialization}
            `;
            
            if (feeResult && feeResult.length > 0) {
                consultationFee = parseFloat(feeResult[0].Consultation_Fee) || 100.00;
                console.log(`Found consultation fee for ${appointment.specialization}: $${consultationFee}`);
            }
        } catch (error) {
            console.log('Could not fetch consultation fee, using default:', error.message);
        }

        // Add consultation fee to appointment data
        appointment.consultation_fee = consultationFee;

        // Get billing details for this appointment (using only existing columns)
        const billingResult = await sql`
            SELECT 
                b."Bill_ID",
                b."Total_Amount"
            FROM "Billing" b
            WHERE b."Appointment_ID" = ${appointmentId}
            ORDER BY b."Bill_ID" DESC
            LIMIT 1
        `;

        let billing;
        if (!billingResult || billingResult.length === 0) {
            // Create a placeholder bill if none exists
            billing = {
                Bill_ID: 'TBD',
                Total_Amount: '0.00',
                bill_date: new Date().toISOString().split('T')[0],
                due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
        } else {
            billing = {
                ...billingResult[0],
                bill_date: new Date().toISOString().split('T')[0],
                due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
        }

        // Get insurance claims for this bill (only if bill exists)
        let insuranceClaimsResult = [];
        if (billing.Bill_ID !== 'TBD') {
            insuranceClaimsResult = await sql`
                SELECT 
                    ic."Insurance_Claim_ID",
                    ic."Claim_Amount",
                    ic."Claim_Status",
                    ic."Submitted_Date",
                    i."Provider_Name",
                    i."Coverage_Percentage"
                FROM "Insurance_Claim" ic
                JOIN "Insurance" i ON ic."Insurance_ID" = i."Insurance_ID"
                WHERE ic."Bill_ID" = ${billing.Bill_ID}
            `;
        }

        // Calculate totals
        const totalAmount = parseFloat(billing.Total_Amount);
        const insuredAmount = insuranceClaimsResult.reduce((sum, claim) => {
            return sum + (claim.Claim_Status === 'Approved' ? parseFloat(claim.Claim_Amount) : 0);
        }, 0);
        const amountToBePaid = totalAmount - insuredAmount;

        return {
            appointment: appointment,
            billing: billing,
            insuranceClaims: insuranceClaimsResult,
            totals: {
                totalAmount: totalAmount,
                insuredAmount: insuredAmount,
                amountToBePaid: amountToBePaid
            }
        };
    } catch (error) {
        console.error('Error getting bill details:', error);
        throw error;
    }
};