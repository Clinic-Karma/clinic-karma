import { Router } from "express";
import { registerPatient, login } from "../controllers/authController";

const router = Router();

router.post("/register-patient", registerPatient);
router.post("/login", login);