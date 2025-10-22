import {
    getAppointmentsByPatient,
    getLabReportsByPatient,
    getPaymentsByPatient,
    getBillsByPatient,
    getDetails,
    putDetails,
    getMedicalHistory
} from "../db_utils/patient_y.js";

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