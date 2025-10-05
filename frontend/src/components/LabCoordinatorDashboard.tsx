import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, FileText, Search, FlaskConical, Activity, FileCheck, Home, Bell, LogOut, User, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";

const LabCoordinatorDashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientSearchOpen, setPatientSearchOpen] = useState(false);
  const [appointmentSearchOpen, setAppointmentSearchOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className={`relative container mx-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-8'}`}>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Lab Coordinator Dashboard</h1>
              <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>Manage laboratory reports and patient test results</p>
            </div>
            <div className="flex gap-2 items-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className={`border-primary-foreground/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 shadow-button ${isMobile ? 'px-3' : ''}`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`border-primary-foreground/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 shadow-button ${isMobile ? 'px-3' : 'px-4'}`}
                  >
                    Profile
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm border-border/50">
                  <DropdownMenuItem className="hover:bg-primary/10">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-primary/10">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/'} className="hover:bg-destructive/10 text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-72 bg-gradient-to-b from-card via-card/95 to-muted/20 border-r border-border/50 shadow-lg backdrop-blur-sm">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Navigation</h3>
                <div className="h-1 w-12 bg-gradient-primary rounded-full"></div>
              </div>
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'upload' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'upload' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Upload Reports</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'reports' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'reports' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Lab Reports</span>
                </button>
                <button
                  onClick={() => setActiveTab('patients')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'patients' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'patients' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Patients</span>
                </button>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Upload Lab Reports</h2>
                <p className="text-muted-foreground mb-8">Upload and manage laboratory test reports for patients</p>
              </div>
              
              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 rounded-full bg-gradient-primary">
                      <Upload className="w-6 h-6 text-primary-foreground" />
                    </div>
                    Lab Report Upload
                  </CardTitle>
                  <p className="text-muted-foreground ml-12">Select patient and upload their lab test results</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                      <DialogTrigger asChild>
                        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 cursor-pointer">
                          <CardContent className="p-8 text-center">
                            <div className="p-4 rounded-full bg-gradient-primary mx-auto mb-4 w-fit">
                              <Upload className="w-10 h-10 text-primary-foreground" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">Upload Report</h3>
                            <p className="text-sm text-muted-foreground">Click to upload new lab reports</p>
                          </CardContent>
                        </Card>
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
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Lab Reports Tab */}
      <TabsContent value="reports" className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Lab Reports</h2>
          <p className="text-muted-foreground mb-8">View and manage all laboratory reports</p>
        </div>
        
        <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <FlaskConical className="w-5 h-5 text-primary-foreground" />
              </div>
              Recent Lab Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <div className="p-6 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 mx-auto mb-6 w-fit">
                <FileCheck className="w-16 h-16 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">No Reports Available</h3>
              <p className="text-muted-foreground max-w-md mx-auto">Lab reports will appear here once they are uploaded to the system.</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Patients Tab */}
      <TabsContent value="patients" className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Patient Information</h2>
          <p className="text-muted-foreground mb-8">View patient details and their lab history</p>
        </div>
        
        <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-secondary">
                <Users className="w-5 h-5 text-secondary-foreground" />
              </div>
              Patient Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {mockPatients.map((patient) => (
                <div key={patient.id} className="border border-border/50 rounded-xl p-5 space-y-3 bg-gradient-to-r from-background to-muted/10 hover:shadow-lg transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-semibold text-lg">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">Patient ID: {patient.id}</p>
                      <p className="text-sm text-muted-foreground">NIC: {patient.nic}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      </Tabs>
    </main>
  </div>

  {/* Mobile Bottom Navigation */}
  {isMobile && (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 shadow-lg">
      <div className="grid grid-cols-3 gap-1 p-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
            activeTab === 'upload' 
              ? 'bg-gradient-primary text-primary-foreground shadow-button' 
              : 'hover:bg-muted/50'
          }`}
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs font-medium">Upload</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
            activeTab === 'reports' 
              ? 'bg-gradient-primary text-primary-foreground shadow-button' 
              : 'hover:bg-muted/50'
          }`}
        >
          <FlaskConical className="w-5 h-5" />
          <span className="text-xs font-medium">Reports</span>
        </button>
        <button
          onClick={() => setActiveTab('patients')}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
            activeTab === 'patients' 
              ? 'bg-gradient-primary text-primary-foreground shadow-button' 
              : 'hover:bg-muted/50'
          }`}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs font-medium">Patients</span>
        </button>
      </div>
    </div>
  )}
</div>
);
};

export default LabCoordinatorDashboard;