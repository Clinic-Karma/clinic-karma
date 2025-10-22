import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import apiClient from "../../utils/axiosConfig";
import { useState, useEffect } from 'react';

const VITE_UPLOAD_URL = import.meta.env.VITE_UPLOAD_URL; // For Vite


const LabReportsModal = ({ patient, open, onOpenChange }: any) => {

  const [labReports, setLabReports] = useState([]);

  const patientId = patient?.patient_id;

  const fetchLabReports = async () => {
    try {
      const response = await apiClient.get(`/patient/labreports/${patientId}`);
      console.log(response.data, "aaa");
      setLabReports(response.data);
    } catch (error) {
      console.error("Error fetching lab reports");
    }
  }

  useEffect(() => {
    if (patientId) {
      fetchLabReports();
    }
  }, [patientId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl shadow-xl border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Lab Reports — {patient?.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-2 pr-2 space-y-3">
          {labReports.map((report, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 rounded-xl border border-border/40 bg-muted/30 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{report.name}</span>
              </div>
                        {report.link && (
                            <>
                              {report.link.startsWith('/uploads/') ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const directUrl = `${VITE_UPLOAD_URL}${report.link}`;
                                      console.log('Opening file:', directUrl);
                                      window.open(directUrl, '_blank');
                                    }}
                                    className="flex items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" />
                                    View Report
                                  </Button>
                                </>
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
                            </>
                          )}
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LabReportsModal;
