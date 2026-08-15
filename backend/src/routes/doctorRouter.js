import { Router } from "express";
import { fetchAppointments, fetchPatients, updateAppointments, fetchSpecs } from '../controllers/doctorController.js';
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

export const router = Router();

// Protected routes - require authentication and doctor role
router.get("/appointments/:doctorID", requireAuth, requireRole('doctor'), fetchAppointments);
router.get("/patients/:doctorID", requireAuth, requireRole('doctor'), fetchPatients);
router.post("/notes", requireAuth, requireRole('doctor'), updateAppointments);

router.get("/specs/:did", requireAuth, requireRole('doctor'), fetchSpecs);

export default router;
