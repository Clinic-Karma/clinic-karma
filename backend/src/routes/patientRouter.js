import { Router } from "express";
import {
    fetchSpecializations,
    fetchDoctorsBySpecializationAndBranch,
    fetchAvailableTimeSlots,
    storeAppointment
} from "../controllers/appointmentController_y.js";

import {
    fetchLabReports,
    fetchAppointments,
    fetchPayments,
    fetchBills,
    fetchDetails,
    updateDetails,
    fetchMedicalHistory
} from "../controllers/patientController_y.js";

import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

export const router = Router();

// Public routes (no authentication required)
router.get("/specializations", fetchSpecializations);
router.get("/doctors/:specializationId/:branch", fetchDoctorsBySpecializationAndBranch);
router.get("/available-timeslots/:doctorId/:date", fetchAvailableTimeSlots);

// Protected routes - require authentication and patient role
router.post("/appointment", requireAuth, requireRole('patient'), storeAppointment);
router.get("/appointments/:patientId", requireAuth, requireRole('patient'), fetchAppointments);
router.get("/labreports/:patientId", requireAuth, requireRole('patient'), fetchLabReports);
router.get("/payments/:patientId", requireAuth, requireRole('patient'), fetchPayments);
router.get("/bills/:patientId", requireAuth, requireRole('patient'), fetchBills);

router.get("/details/:patientId", requireAuth, requireRole("patient"), fetchDetails);
router.put("/details/:patientId", requireAuth, requireRole("patient"), updateDetails);

router.get(`/medical-history/:pid`, fetchMedicalHistory);

export default router;