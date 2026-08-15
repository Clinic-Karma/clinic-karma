import {
    addAppointment,
    getAppointmentsByPatient,
    getLabReportsByPatient,
    getPaymentsByPatient,
    getBillsByPatient,
    getDetails,
    putDetails,
    getMedicalHistory
} from '../db_utils/patient.js';
import {
    getSpecializations,
    getDoctorsBySpecializationAndBranch,
    getAvailableTimeSlots,
} from '../db_utils/doctor.js';

export async function fetchSpecializations(req, res) {
    try {
        return res.json(await getSpecializations());
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}

export async function fetchDoctorsBySpecializationAndBranch(req, res) {
    const { specializationId, branch } = req.params;

    if (!specializationId || !branch) {
        return res.status(400).json({ message: 'Specialization ID and branch are required' });
    }

    try {
        return res.json(await getDoctorsBySpecializationAndBranch(specializationId, branch));
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}

export async function fetchAvailableTimeSlots(req, res) {
    const { doctorId, date } = req.params;

    if (!doctorId || !date) {
        return res.status(400).json({ message: 'Doctor ID and date are required' });
    }

    try {
        return res.json(await getAvailableTimeSlots(doctorId, date));
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}

export async function storeAppointment(req, res) {
    const { patientId, doctorId, date, status, startTime, type, branch, specializationId } = req.body;

    if (!patientId || !doctorId || !date || !status || !startTime || !type || !branch || !specializationId) {
        return res.status(400).json({ message: 'All appointment details are required' });
    }

    try {
        const appointmentId = await addAppointment(
            patientId,
            doctorId,
            date,
            status,
            startTime,
            type,
            branch,
            specializationId
        );
        return res.status(201).json({ appointment_id: appointmentId });
    } catch (error) {
        return res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
}

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

export async function fetchBills(req, res) {
  const { patientId } = req.params;

  if (!patientId) {
    return res.status(400).json({ message: 'Patient ID is required' });
  }

  try {
    const bills = await getBillsByPatient(patientId);
    // Update each bill's status
    const updatedBills = bills.map((bill) => ({
      ...bill,
      status: bill.total_amount - bill.insured_amount - bill.patient_amount <= 0 ? 'Paid' : 'Pending'
    }));

    return res.json(updatedBills);
  } catch (error) {
    console.error('Error fetching bills:', error); // Log for debugging
    return res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
}

export async function fetchDetails(req, res) {
    const patientId = req.params.patientId;

    if (!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
    }

    try {
        const details = await getDetails(patientId);
        return res.json(details);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export async function updateDetails(req, res) {
    const patientId = req.params.patientId;
    const { contactNumber, emmergencyContact, address } = req.body;

    if (!patientId) {
        return res.status(400).json({ message: "Patient ID is required" });
    }

    try {
        await putDetails(patientId, contactNumber, emmergencyContact, address);
        return res.json({ message: "success" });
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

export async function fetchMedicalHistory(req, res) {
      const pid  = req.params.pid;
  try {
      const result = await getMedicalHistory(pid);
      return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch medical history" });
  }
}
