import { Router } from "express";
import { registerPatient, login } from "../controllers/authController.js";

export const router = Router();

router.post("/register-patient", registerPatient);
router.post("/login", login);

export default router;