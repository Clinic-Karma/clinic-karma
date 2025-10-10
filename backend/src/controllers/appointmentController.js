import { getSpelizations, getDoctorsBySpecialization_Branch, getAvailableTimeSlots } from "../db_utils/doctor.js";
import { addAppointment } from "../db_utils/patient.js";

export async function fetchSpecializations(req, res) {
    try {
        const specializations = await getSpelizations();
        return res.json(specializations);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export async function fetchDoctorsBySpecializationAndBranch(req, res) {
    const { specializationId, branch } = req.params;

    if (!specializationId || !branch) {
        return res.status(400).json({ message: "Specialization ID and Branch are required" });
    }

    try {
        const doctors = await getDoctorsBySpecialization_Branch(specializationId, branch);
        return res.json(doctors);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export async function fetchAvailableTimeSlots(req, res) {
    const { doctorId, date } = req.params;

    if (!doctorId || !date) {
        return res.status(400).json({ message: "Doctor ID and Date are required" });
    }

    try {
        const timeSlots = await getAvailableTimeSlots(doctorId, date);
        return res.json(timeSlots);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export async function storeAppointment(req, res) {
    const { patientId, doctorId, date, status, startTime, type, branch, specializationId } = req.body;

    if (!patientId || !doctorId || !date || !status || !startTime || !type || !branch || !specializationId) {
        return res.status(400).json({ message: "All appointment details are required" });
    }

    try {
        const appointment = await addAppointment(patientId, doctorId, date, status, startTime, type, branch, specializationId);
        return res.status(201).json(appointment);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}
