import { Router } from "express";
import { fetchAppointments, fetchPatients, updateAppointments } from "../controllers/doctorController_y.js";
import { requireAuth, requireRole } from "../middlewares/authMiddleware.js";

export const router = Router();

// Protected routes - require authentication and doctor role
router.get("/appointments/:doctorID", requireAuth, requireRole('doctor'), fetchAppointments);
router.get("/patients/:doctorID", requireAuth, requireRole('doctor'), fetchPatients);
router.post("/notes", requireAuth, requireRole('doctor'), updateAppointments);

export default router;