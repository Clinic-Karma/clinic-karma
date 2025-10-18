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
    fetchBills
} from "../controllers/patientController_y.js";

export const router = Router();

// Route to get all specializations
router.get("/specializations", fetchSpecializations);

// Route to get doctors by specialization and branch
router.get("/doctors/:specializationId/:branch", fetchDoctorsBySpecializationAndBranch);

router.get("/available-timeslots/:doctorId/:date", fetchAvailableTimeSlots);

router.post("/appointment", storeAppointment);
    
router.get("/appointments/:patientId", fetchAppointments);

router.get("/labreports/:patientId", fetchLabReports);

router.get("/payments/:patientId", fetchPayments);

router.get("/bills/:patientId", fetchBills);

export default router;