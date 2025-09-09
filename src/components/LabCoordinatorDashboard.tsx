import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileText, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const LabCoordinatorDashboard = () => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [appointmentSearchOpen, setAppointmentSearchOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const { toast } = useToast();

  // Mock data - in real app this would come from API
  const mockPatients = [
    { id: "P001", name: "John Doe", nic: "123456789V" },
    { id: "P002", name: "Jane Smith", nic: "987654321V" },
    { id: "P003", name: "Bob Johnson", nic: "456789123V" },
  ];

  const mockAppointments = [
    { id: "A001", patientId: "P001", doctorName: "Dr. Wilson", date: "2024-01-15" },
    { id: "A002", patientId: "P002", doctorName: "Dr. Brown", date: "2024-01-16" },
    { id: "A003", patientId: "P001", doctorName: "Dr. Davis", date: "2024-01-17" },
  ];

  const treatmentCatalogue = [
    "Blood Test - Complete Blood Count",
    "Blood Test - Lipid Profile", 
    "Urine Test - Routine",
    "X-Ray - Chest",
    "X-Ray - Limb",
    "MRI - Brain",
    "CT Scan - Abdomen",
    "ECG",
    "Ultrasound"
  ];

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const filteredAppointments = selectedPatient 
    ? mockAppointments.filter(apt => apt.patientId === selectedPatient.id)
    : [];

  const handleUploadReport = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Lab Report Uploaded",
      description: "The lab report has been successfully uploaded.",
    });
    setIsUploadDialogOpen(false);
    setSelectedPatient(null);
    setSelectedAppointment(null);
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
                    {/* Patient ID - Dropdown Search */}
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Popover open={patientSearchOpen} onOpenChange={setPatientSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={patientSearchOpen}
                            className="w-full justify-between"
                          >
                            {selectedPatient
                              ? `${selectedPatient.id} - ${selectedPatient.name}`
                              : "Search by ID, Name, or NIC..."}
                            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search patients..." />
                            <CommandList>
                              <CommandEmpty>No patient found.</CommandEmpty>
                              <CommandGroup>
                                {mockPatients.map((patient) => (
                                  <CommandItem
                                    key={patient.id}
                                    value={`${patient.id} ${patient.name} ${patient.nic}`}
                                    onSelect={() => {
                                      setSelectedPatient(patient);
                                      setSelectedAppointment(null);
                                      setPatientSearchOpen(false);
                                    }}
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-medium">{patient.id} - {patient.name}</span>
                                      <span className="text-sm text-muted-foreground">NIC: {patient.nic}</span>
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Patient Name - Auto-filled */}
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input 
                        id="patientName" 
                        value={selectedPatient?.name || ""} 
                        placeholder="Auto-filled when patient is selected"
                        readOnly 
                        className="bg-muted"
                      />
                    </div>

                    {/* Appointment ID - Linked to Patient */}
                    <div className="space-y-2">
                      <Label htmlFor="appointmentId">Appointment ID</Label>
                      <Select 
                        disabled={!selectedPatient}
                        onValueChange={(value) => {
                          const appointment = filteredAppointments.find(apt => apt.id === value);
                          setSelectedAppointment(appointment);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={selectedPatient ? "Select appointment" : "Select patient first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {filteredAppointments.map((appointment) => (
                            <SelectItem key={appointment.id} value={appointment.id}>
                              {appointment.id} - {appointment.doctorName} ({appointment.date})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Treatment Name - Dropdown from Catalogue */}
                    <div className="space-y-2">
                      <Label htmlFor="treatmentName">Treatment Name</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select treatment from catalogue" />
                        </SelectTrigger>
                        <SelectContent>
                          {treatmentCatalogue.map((treatment, index) => (
                            <SelectItem key={index} value={treatment}>
                              {treatment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Report File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="reportFile">Report File Upload</Label>
                      <Input 
                        id="reportFile" 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                        required 
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                      />
                    </div>

                    {/* Date & Time - Auto set to current */}
                    <div className="space-y-2">
                      <Label htmlFor="dateTime">Date & Time</Label>
                      <Input 
                        id="dateTime" 
                        type="datetime-local" 
                        defaultValue={getCurrentDateTime()}
                        required 
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsUploadDialogOpen(false);
                          setSelectedPatient(null);
                          setSelectedAppointment(null);
                        }}
                      >
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