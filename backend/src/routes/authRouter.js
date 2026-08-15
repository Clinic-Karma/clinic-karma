import { Router } from "express";
import { registerPatient, login, refreshAccessToken, logout } from '../controllers/authController.js';
import { loginLimiter, refreshLimiter } from "../middlewares/rateLimiter.js";

export const router = Router();


router.post("/register-patient", registerPatient);
router.post("/login", loginLimiter, login);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

export default router;
