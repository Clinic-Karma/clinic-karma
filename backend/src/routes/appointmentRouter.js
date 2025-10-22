import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { body } from 'express-validator';
import upload from '../middlewares/uploadMiddleware.js';
import { requireAuth, requireRole } from '../middlewares/authMiddleware.js';

export const router = Router();

// Test endpoints
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Appointment router is working',
        timestamp: new Date().toISOString(),
        version: '2.0 - Reschedule fix applied'
    });
});

// Debug endpoint to check lab reports
router.get('/debug-lab-reports', async (req, res) => {
    try {
        const reports = await appointmentController.getLabReports(req, res);
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            success: false,
            message: 'Debug error',
            error: error.message
        });
    }
});

// Debug endpoint to check appointments without Doctor_Appointment records
router.get('/debug-appointments-integrity', async (req, res) => {
    try {
        const { sql } = await import('../db_utils/db.js');
        
        // Find appointments without Doctor_Appointment records
        const orphanedAppointments = await sql`
            SELECT a."Appointment_ID", a."Appointment_Date", a."Status", a."Type"
            FROM "Appointment" a
            LEFT JOIN "Doctor_Appointment" da ON a."Appointment_ID" = da."Appointment_ID"
            WHERE da."Appointment_ID" IS NULL
        `;
        
        res.json({
            success: true,
            message: 'Appointments without Doctor_Appointment records',
            count: orphanedAppointments.length,
            appointments: orphanedAppointments
        });
    } catch (error) {
        console.error('Debug error:', error);
        res.status(500).json({
            success: false,
            message: 'Debug error',
            error: error.message
        });
    }
});

router.get('/patients', appointmentController.getAllPatients);
router.get('/doctors', appointmentController.getAllDoctors);
router.post('/doctors', appointmentController.createDoctor);
router.post('/doctors/test', appointmentController.createDoctorTest);
router.get('/staff', appointmentController.getAllStaff);
router.post('/staff', appointmentController.createStaff);
router.get('/branches', appointmentController.getAllBranches);
router.get('/bills', appointmentController.getAllBills);
router.get('/tables', appointmentController.checkDatabaseTables);
router.get('/doctor-structure', appointmentController.checkDoctorTableStructure);
router.get('/staff-structure', appointmentController.checkStaffTableStructure);
router.get('/user-structure', appointmentController.checkUserTableStructure);
router.get('/appointment-structure', appointmentController.checkAppointmentTableStructure);
router.get('/patient-structure', appointmentController.checkPatientTableStructure);

// Validation middleware
const bookAppointmentValidation = [
    body('patientUsername').notEmpty().withMessage('Patient username is required'),
    body('doctorId').isInt({ min: 1 }).withMessage('Doctor ID must be a valid positive integer'),
    body('appointmentDate').isISO8601().withMessage('Appointment date must be a valid date'),
    body('timeSlot').notEmpty().withMessage('Time slot is required'),
    body('specialization').notEmpty().withMessage('Specialization is required'),
    body('branch').notEmpty().withMessage('Branch is required')
];

const rescheduleAppointmentValidation = [
    body('appointmentId').isInt({ min: 1 }).withMessage('Appointment ID must be a valid positive integer'),
    body('newDate').isISO8601().withMessage('New date must be a valid date'),
    body('newTimeSlot').notEmpty().withMessage('New time slot is required')
];

const cancelAppointmentValidation = [
    body('appointmentId').isInt({ min: 1 }).withMessage('Appointment ID must be a valid positive integer')
];

// Book appointment - allow patients and receptionists
router.post('/book', requireAuth, requireRole('patient', 'receptionist'), bookAppointmentValidation, appointmentController.bookAppointment);

// Reschedule appointment - allow patients and receptionists
router.post('/reschedule', requireAuth, requireRole('patient', 'receptionist'), rescheduleAppointmentValidation, appointmentController.rescheduleAppointment);

// Cancel appointment - allow patients and receptionists
router.post('/cancel', requireAuth, requireRole('patient', 'receptionist'), cancelAppointmentValidation, appointmentController.cancelAppointment);

// Get appointments for patient
// Static and specific routes first to avoid conflicts with parameterized routes
router.get('/specializations', appointmentController.fetchSpecializations);
router.get('/doctors/:specializationId/:branch', appointmentController.fetchDoctorsBySpecializationAndBranch);
router.get('/available-slots/:doctorId/:date', appointmentController.fetchAvailableTimeSlots);
router.get('/date/:date', appointmentController.getAppointmentsByDate);
router.get('/doctor/:doctorId/date/:date', appointmentController.getAppointmentsByDoctorAndDate);

// Insurance endpoints
router.get('/pending-insurances', appointmentController.getPendingInsurances);
router.put('/update-insurance-status', appointmentController.updateInsuranceStatus);
router.get('/insurance-providers', appointmentController.getAllInsuranceProviders);
router.post('/add-patient-insurance', appointmentController.addPatientInsurance);
router.get('/patient-insurances-by-bill/:billId', appointmentController.getPatientInsurancesByBillId);
router.post('/submit-insurance-claim', appointmentController.submitInsuranceClaim);
router.get('/insurance-structure', appointmentController.checkInsuranceTableStructure);
router.get('/patient-insurance-structure', appointmentController.checkPatientInsuranceTableStructure);
router.get('/insurance-claim-structure', appointmentController.checkInsuranceClaimTableStructure);
router.get('/billing-structure', appointmentController.checkBillingTableStructure);
router.get('/specialization-structure', appointmentController.checkSpecializationTableStructure);
router.get('/specialization-data', appointmentController.getSpecializationData);
router.get('/billing-data', appointmentController.getBillingData);
router.get('/test-bill-details/:appointmentId', appointmentController.testBillDetailsWithInsurance);
router.get('/demonstrate-insurance-calculation', appointmentController.demonstrateInsuranceCalculation);
router.get('/test-specialization-fee', appointmentController.testSpecializationFee);

// Billing endpoints
router.get('/bill-details/:appointmentId', appointmentController.getBillDetailsByAppointment);
router.post('/generate-bill/:appointmentId', appointmentController.generateBill);
router.post('/update-payment', appointmentController.updatePaymentAmount);
router.get('/payment-history/:billId', appointmentController.getPaymentHistory);
router.post('/create-test-insurance', appointmentController.createTestInsuranceData);
router.get('/test-insurance-calculation/:patientUsername', appointmentController.testInsuranceCalculation);
router.get('/debug-insurance/:patientUsername', appointmentController.debugPatientInsurance);
router.get('/billing-structure', appointmentController.checkBillingTableStructure);
router.post('/add-insured-amount-column', appointmentController.addInsuredAmountColumn);
router.post('/add-insurance-provider', appointmentController.addInsuranceProvider);
router.post('/fix-insurance-schema', appointmentController.fixInsuranceTableSchema);
router.post('/add-patient-insurance-status-column', appointmentController.addPatientInsuranceStatusColumn);

// Lab Report endpoints - require authentication
router.post('/upload-lab-report', requireAuth, upload.single('reportFile'), appointmentController.uploadLabReport);
router.get('/lab-reports', requireAuth, appointmentController.getLabReports);
router.get('/lab-report/:appointmentId', requireAuth, appointmentController.getLabReportByAppointment);
router.get('/download-lab-report/:appointmentId', requireAuth, appointmentController.downloadLabReport);
router.delete('/lab-report/:appointmentId', requireAuth, appointmentController.deleteLabReport);

// Patient registration endpoints
router.post('/register-patient', appointmentController.registerPatient);
router.get('/check-username/:username', appointmentController.checkUsernameAvailability);
router.get('/check-email/:email', appointmentController.checkEmailAvailability);

// Other collections
router.get('/patient/:username', appointmentController.getAppointmentsByPatient);
router.get('/', appointmentController.getAllAppointments);

// Parameter route last
router.get('/:appointmentId', appointmentController.getAppointmentById);

export default router;