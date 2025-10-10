import { getUpcomingAppointments, getPatients, updateAppointmentDetails } from "../db_utils/doctor.js";

export async function fetchAppointments(req, res) {
    const doctorID = req.params.doctorID;

    const today = new Date().toISOString().split('T')[0];

    try {
        const appointment = await getUpcomingAppointments(doctorID, today);
        return res.json(appointment);
    }
    catch (err) {
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
}

export async function fetchPatients(req, res) {
    const doctorID = req.params.doctorID;

    try {
        const patients = await getPatients(doctorID);
        return res.json(patients);
    }
    catch (err) {
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }    
}

export async function updateAppointments(req, res) {
    const { appointmentId, diagnosis, prescription, additional_notes } = req.body;
    
    try {
        await updateAppointmentDetails(appointmentId, diagnosis, prescription, additional_notes);
        return res.json({ message: "Appointment details updated successfully" });
    }
    catch (err) {
        return res.status(500).json({ message: err.message || "Internal Server Error" });
    }
}

