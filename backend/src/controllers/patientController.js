import { addPatient } from "../db_utils/patient.js";
// Register new patient
export async function registerPatient(req, res) {
    const { name, dob, gender, contact_number, address, nic, emmergency_contact_number, username, password } = req.body;
    if (!name || !dob || !gender || !contact_number || !address || !nic || !emmergency_contact_number || !username || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const result = await addPatient({ name, dob, gender, contact_number, address, nic, emmergency_contact_number, username, password });
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}
import { getAppointmentsByPatient, getLabReportsByPatient, getPaymentsByPatient } from "../db_utils/patient.js";

export async function fetchAppointments(req, res) {
    const patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
    }

    try {
        const appointments = await getAppointmentsByPatient(patientId);
        return res.json(appointments);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export async function fetchLabReports(req, res) {
    const patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
    }

    try {
        const labReports = await getLabReportsByPatient(patientId);
        return res.json(labReports);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export async function fetchPayments(req, res) {
    const patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
    }

    try {
        const payments = await getPaymentsByPatient(patientId);
        return res.json(payments);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}