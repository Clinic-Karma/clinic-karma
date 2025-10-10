import { Router } from "express";
import { fetchAppointments, fetchPatients, updateAppointments } from "../controllers/doctorController.js";

export const router = Router();

router.get("/appointments/:doctorID", fetchAppointments);
router.get("/patients/:doctorID", fetchPatients);
router.post("/notes", updateAppointments);

export default router;