import { Router } from "express";
import {
    fetchSpecializations,
    fetchDoctorsBySpecializationAndBranch,
    fetchAvailableTimeSlots,
    storeAppointment
} from "../controllers/appointmentController.js";

export const router = Router();

// Route to get all specializations
router.get("/specializations", fetchSpecializations);

// Route to get doctors by specialization and branch
router.get("/doctors/:specializationId/:branch", fetchDoctorsBySpecializationAndBranch);

router.get("/available-timeslots/:doctorId/:date", fetchAvailableTimeSlots);

router.post("/appointment", storeAppointment);

export default router;