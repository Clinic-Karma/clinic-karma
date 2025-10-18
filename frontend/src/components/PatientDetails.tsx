import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite


export default function PatientDetails({ patient, appointmentId, open, onOpenChange }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSave = async () => {
    try {

      console.log(appointmentId, diagnosis, prescription, notes);

      await axios.post  (`${API_BASE_URL}/doctor/notes`, {
        appointmentId: appointmentId,
        diagnosis: diagnosis,
        prescription: prescription,
        additional_notes: notes
      });

      toast({
        title: "Success",
        description: "Doctor notes saved successfully.",
      });

      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to save notes.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg space-y-4">
        <DialogHeader>
          <DialogTitle>Patient Details: {patient?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label>Diagnosis</Label>
          <Textarea
            placeholder="Enter diagnosis..."
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
          />

          <Label>Prescription</Label>
          <Textarea
            placeholder="Enter prescription..."
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
          />

          <Label>Additional Notes</Label>
          <Textarea
            placeholder="Enter additional notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex justify-end mt-4">
            <Button onClick={handleSave} className="bg-primary">
              Save Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
