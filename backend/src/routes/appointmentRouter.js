import { Router } from 'express';
import * as appointmentController from '../controllers/appointmentController.js';
import { body } from 'express-validator';
import upload from '../middlewares/uploadMiddleware.js';

export const router = Router();

// Test endpoints
router.get('/test', (req, res) => {
    res.json({ 
        success: true, 
        message: 'Appointment router is working',
        timestamp: new Date().toISOString()
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

router.get('/test-db', appointmentController.testDatabaseConnection);
router.get('/patients', appointmentController.getAllPatients);
router.get('/doctors', appointmentController.getAllDoctors);
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

// Book appointment
router.post('/book', bookAppointmentValidation, appointmentController.bookAppointment);

// Reschedule appointment
router.post('/reschedule', rescheduleAppointmentValidation, appointmentController.rescheduleAppointment);

// Cancel appointment
router.post('/cancel', cancelAppointmentValidation, appointmentController.cancelAppointment);

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
router.post('/submit-insurance-claim', appointmentController.submitInsuranceClaim);
router.get('/insurance-structure', appointmentController.checkInsuranceTableStructure);
router.get('/patient-insurance-structure', appointmentController.checkPatientInsuranceTableStructure);
router.get('/insurance-claim-structure', appointmentController.checkInsuranceClaimTableStructure);
router.get('/billing-structure', appointmentController.checkBillingTableStructure);

// Billing endpoints
router.get('/bill-details/:appointmentId', appointmentController.getBillDetailsByAppointment);

// Lab Report endpoints
router.post('/upload-lab-report', upload.single('reportFile'), appointmentController.uploadLabReport);
router.get('/lab-reports', appointmentController.getLabReports);
router.get('/lab-report/:appointmentId', appointmentController.getLabReportByAppointment);
router.get('/download-lab-report/:appointmentId', appointmentController.downloadLabReport);

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