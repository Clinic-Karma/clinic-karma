import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import apiClient from "../../utils/axiosConfig";

const MedicalHistoryModal = ({ patient, open, onOpenChange }: any) => {
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMedicalHistory = async () => {
    if (!patient?.patient_id) return;
    setLoading(true);
    try {
      const res = await apiClient.get(`/patient/medical-history/${patient.patient_id}`);
      setMedicalHistory(res.data || []);
    } catch (err) {
      console.error("Error fetching medical history:", err);
      setMedicalHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getTime = (time: string) => {
    if (!time) return 'N/A';
    try {
      const [date, t] = time.split("T");
      return `${date} ${t.slice(0, 8)}`;
    } catch {
      return 'N/A';
    }
  };

  useEffect(() => {
    setMedicalHistory([]); // Clear old data before loading new
    if (open && patient?.patient_id) {
      fetchMedicalHistory();
    }
  }, [patient, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl shadow-xl border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Medical History — {patient?.name || "Unknown"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-2 space-y-3 pr-2">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
          ) : medicalHistory.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No medical history records found.
            </p>
          ) : (
            medicalHistory.map((record, i) => (
              <Card
                key={i}
                className="rounded-xl border border-border/40 bg-muted/30 hover:bg-accent/40 transition-colors"
              >
                <CardContent className="p-4 text-sm space-y-1.5">
                  <p><span className="font-medium text-muted-foreground">Appointment ID:</span> {record.appointment_id}</p>
                  <p><span className="font-medium text-muted-foreground">Appointment Date:</span> {getTime(record.date)}</p>
                  <p><span className="font-medium text-muted-foreground">Doctor:</span> {record.name}</p>
                  <p><span className="font-medium text-muted-foreground">Diagnosis:</span> {record.diagnosis}</p>
                  <p><span className="font-medium text-muted-foreground">Prescription:</span> {record.prescription}</p>
                  <p><span className="font-medium text-muted-foreground">Notes:</span> {record.notes}</p>
                </CardContent>
              </Card>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalHistoryModal;
