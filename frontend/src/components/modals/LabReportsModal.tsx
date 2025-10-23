import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import apiClient from "../../utils/axiosConfig";
import { useState, useEffect } from 'react';

const VITE_UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL; // For Vite

const LabReportsModal = ({ patient, open, onOpenChange }: any) => {
  const [labReports, setLabReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const patientId = patient?.patient_id;

  const fetchLabReports = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const response = await apiClient.get(`/patient/labreports/${patientId}`);
      setLabReports(response.data || []);
    } catch (error) {
      console.error("Error fetching lab reports", error);
      setLabReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLabReports([]); // clear previous reports
    if (open && patientId) {
      fetchLabReports();
    }
  }, [patientId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl shadow-xl border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Lab Reports — {patient?.name || "Unknown"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-2 pr-2 space-y-3">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>
          ) : labReports.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No lab reports found.
            </p>
          ) : (
            labReports.map((report, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 rounded-xl border border-border/40 bg-muted/30 hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{report.name}</span>
                </div>

                {report.link && report.link.startsWith('/uploads/') ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const directUrl = `${VITE_UPLOAD_URL}${report.link}`;
                      window.open(directUrl, '_blank');
                    }}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    View Report
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="flex items-center gap-2 opacity-50"
                    >
                      <FileText className="w-4 h-4" />
                      Report Not Available
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      This report was uploaded with an old system
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LabReportsModal;
