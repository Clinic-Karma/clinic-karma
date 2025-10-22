import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useEffect } from 'react';
import apiClient from "../../utils/axiosConfig";

const MedicalHistoryModal = ({ patient, open, onOpenChange }: any) => {

  const [medicalHistory, setMedicalHistory] = useState([]);

  const fetch = async () => {
    if (patient?.patient_id) {
      const res = await apiClient.get(`/patient/medical-history/${patient.patient_id}`)
      console.log(res.data);
      setMedicalHistory(res.data);
    }
  }

  const getTime = (time) => {
    if (!time) return 'N/A';
    try {
      const x = time.split("T");
      return `${x[0]} ${x[1].slice(0,8)}`;
    } catch {
      return 'N/A';
    }
  };

  useEffect(() => {
    fetch();
  }, [open, patient]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl shadow-xl border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Medical History — {patient?.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-2 space-y-3 pr-2">
          {medicalHistory.map((record, i) => (
            <Card key={i} className="rounded-xl border border-border/40 bg-muted/30 hover:bg-muted/40 transition-colors">
              <CardContent className="p-4 text-sm space-y-1.5">
                <p><span className="font-medium text-muted-foreground">Appointment ID:</span> {record.appointment_id}</p>
                <p><span className="font-medium text-muted-foreground">Appointment Date:</span> {getTime(record.date)}</p>
                <p><span className="font-medium text-muted-foreground">Doctor:</span> {record.name}</p>
                <p><span className="font-medium text-muted-foreground">Diagnosis:</span> {record.diagnosis}</p>
                <p><span className="font-medium text-muted-foreground">Prescription:</span> {record.prescription}</p>
                <p><span className="font-medium text-muted-foreground">Notes:</span> {record.notes}</p>
              </CardContent>
            </Card>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalHistoryModal;
