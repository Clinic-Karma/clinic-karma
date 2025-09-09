import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const LabCoordinatorDashboard = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Lab Report Uploaded",
      description: "The lab report has been successfully uploaded.",
    });
    setIsUploadDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Lab Coordinator Dashboard</h1>
          <p className="text-muted-foreground">Manage laboratory reports and patient test results</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Lab Reports
              </CardTitle>
              <CardDescription>Upload and manage laboratory test reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Lab Reports
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Upload Lab Report</DialogTitle>
                    <DialogDescription>
                      Fill in the patient details and upload the lab report
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadReport} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input id="patientName" placeholder="Enter patient name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input id="patientId" placeholder="Enter patient ID" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testType">Test Type</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select test type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blood">Blood Test</SelectItem>
                          <SelectItem value="urine">Urine Test</SelectItem>
                          <SelectItem value="xray">X-Ray</SelectItem>
                          <SelectItem value="mri">MRI</SelectItem>
                          <SelectItem value="ct">CT Scan</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="testDate">Test Date</Label>
                      <Input id="testDate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="doctorName">Referring Doctor</Label>
                      <Input id="doctorName" placeholder="Enter doctor name" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reportFile">Report File</Label>
                      <Input id="reportFile" type="file" accept=".pdf,.jpg,.png,.doc,.docx" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea id="notes" placeholder="Enter any additional notes or observations" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">Upload Report</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LabCoordinatorDashboard;