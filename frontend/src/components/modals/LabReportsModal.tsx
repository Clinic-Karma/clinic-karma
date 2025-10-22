import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";

const LabReportsModal = ({ patient, open, onOpenChange }: any) => {
  const reports = [
    { report_id: "L1001", name: "Blood Test", url: "#" },
    { report_id: "L1002", name: "X-Ray Chest", url: "#" },
    { report_id: "L1003", name: "ECG Report", url: "#" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl shadow-xl border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Lab Reports — {patient?.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] mt-2 pr-2 space-y-3">
          {reports.map((report, i) => (
            <div
              key={i}
              className="flex justify-between items-center p-3 rounded-xl border border-border/40 bg-muted/30 hover:bg-muted/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{report.name}</span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => window.open(report.url, "_blank")}
              >
                View
              </Button>
            </div>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default LabReportsModal;
