import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Calendar as CalendarIcon, Users, UserPlus, Search, Stethoscope, FileText, DollarSign, Clock, User, Eye, Edit, CreditCard, CalendarDays, X, CheckCircle, Home, Bell, LogOut, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State for Book Appointment modal
  const [bookDate, setBookDate] = useState<Date>();
  const [bookSpecialization, setBookSpecialization] = useState("");
  const [bookPatientUsername, setBookPatientUsername] = useState("");
  const [bookDoctor, setBookDoctor] = useState("");
  
  // State for Cancel Appointment modal
  const [cancelPatientUsername, setCancelPatientUsername] = useState("");
  const [cancelAppointment, setCancelAppointment] = useState("");
  
  // State for Reschedule Appointment modal
  const [reschedulePatientUsername, setReschedulePatientUsername] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState<Date>();

  // Sample data for dropdowns
  const specializations = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "Oncology"];
  
  const doctorsBySpecialization: Record<string, string[]> = {
    "Cardiology": ["Dr. Smith", "Dr. Anderson"],
    "Neurology": ["Dr. Johnson", "Dr. Wilson"],
    "Orthopedics": ["Dr. Williams", "Dr. Davis"],
    "Pediatrics": ["Dr. Brown", "Dr. Miller"],
    "Dermatology": ["Dr. Garcia", "Dr. Martinez"],
    "Oncology": ["Dr. Taylor", "Dr. Thomas"]
  };

  const sampleAppointments: Record<string, string[]> = {
    "john_doe": ["Appointment with Dr. Smith - March 15, 2024", "Appointment with Dr. Johnson - March 20, 2024"],
    "jane_smith": ["Appointment with Dr. Williams - March 18, 2024"],
    "bob_johnson": ["Appointment with Dr. Brown - March 22, 2024", "Appointment with Dr. Garcia - March 25, 2024"]
  };

  const handleFormSubmit = (formName: string) => {
    toast({
      title: "Success",
      description: `${formName} completed successfully.`,
    });
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className={`relative container mx-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-8'}`}>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Receptionist Dashboard</h1>
              <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>Streamlined management for appointments and patients</p>
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
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'appointments' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'appointments' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Appointments</span>
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'doctors' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'doctors' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Doctors</span>
                </button>
                <button
                  onClick={() => setActiveTab('insurance')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'insurance' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'insurance' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Insurance</span>
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'billing' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'billing' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Billing</span>
                </button>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

          <TabsContent value="appointments" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Appointment Management</h2>
              <p className="text-muted-foreground mb-8">Efficiently manage all appointment operations</p>
            </div>
            <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-full bg-gradient-primary">
                    <CalendarDays className="w-6 h-6 text-primary-foreground" />
                  </div>
                  Appointment Operations
                </CardTitle>
                <p className="text-muted-foreground ml-12">Book, reschedule, or cancel appointments with ease</p>
              </CardHeader>
              <CardContent>
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-3 gap-6'} mb-8`}>
                  
                  {/* Book Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-gradient-primary mx-auto mb-4 w-fit">
                            <CalendarDays className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Book Appointment</h3>
                          <p className="text-sm text-muted-foreground">Schedule new appointments</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Book New Appointment</DialogTitle>
                        <DialogDescription>Schedule a new appointment for a patient</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Appointment Booking");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bookPatientUsername">Patient Username</Label>
                          <Input 
                            id="bookPatientUsername" 
                            placeholder="Enter patient username" 
                            value={bookPatientUsername}
                            onChange={(e) => setBookPatientUsername(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookSpecialization">Specialization</Label>
                          <Select value={bookSpecialization} onValueChange={(value) => {
                            setBookSpecialization(value);
                            setBookDoctor(""); // Reset doctor when specialization changes
                          }} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              {specializations.map((spec) => (
                                <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookDoctor">Doctor</Label>
                          <Select value={bookDoctor} onValueChange={setBookDoctor} required disabled={!bookSpecialization}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {bookSpecialization && doctorsBySpecialization[bookSpecialization]?.map((doctor) => (
                                <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Appointment Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !bookDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {bookDate ? format(bookDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={bookDate}
                                onSelect={setBookDate}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button type="submit" className="w-full">Book Appointment</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Reschedule Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-gradient-secondary mx-auto mb-4 w-fit">
                            <CheckCircle className="w-8 h-8 text-secondary-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Reschedule</h3>
                          <p className="text-sm text-muted-foreground">Change appointment dates</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Reschedule Appointment</DialogTitle>
                        <DialogDescription>Reschedule an existing appointment to a new date</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Appointment Rescheduling");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reschedulePatientUsername">Patient Username</Label>
                          <Input 
                            id="reschedulePatientUsername" 
                            placeholder="Enter patient username" 
                            value={reschedulePatientUsername}
                            onChange={(e) => setReschedulePatientUsername(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>New Appointment Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !rescheduleDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {rescheduleDate ? format(rescheduleDate, "PPP") : <span>Pick a new date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={rescheduleDate}
                                onSelect={setRescheduleDate}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Button type="submit" className="w-full">Reschedule Appointment</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Cancel Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-destructive/5 to-accent/5 border-destructive/20 cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-destructive mx-auto mb-4 w-fit">
                            <X className="w-8 h-8 text-destructive-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Cancel</h3>
                          <p className="text-sm text-muted-foreground">Cancel existing appointments</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Cancel Appointment</DialogTitle>
                        <DialogDescription>Cancel an existing appointment</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Appointment Cancellation");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cancelPatientUsername">Patient Username</Label>
                          <Select value={cancelPatientUsername} onValueChange={(value) => {
                            setCancelPatientUsername(value);
                            setCancelAppointment(""); // Reset appointment when patient changes
                          }} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(sampleAppointments).map((username) => (
                                <SelectItem key={username} value={username}>{username}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cancelAppointment">Appointment</Label>
                          <Select value={cancelAppointment} onValueChange={setCancelAppointment} required disabled={!cancelPatientUsername}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select appointment to cancel" />
                            </SelectTrigger>
                            <SelectContent>
                              {cancelPatientUsername && sampleAppointments[cancelPatientUsername]?.map((appointment, index) => (
                                <SelectItem key={index} value={appointment}>{appointment}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Cancel Appointment</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                </div>
              </CardContent>
            </Card>

            {/* Patient Management Section */}
            <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-full bg-gradient-secondary">
                    <Users className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  Patient Management
                </CardTitle>
                <p className="text-muted-foreground ml-12">Register new patients and manage patient information</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-success/5 to-accent/5 border-success/20 cursor-pointer">
                        <CardContent className="p-8 text-center">
                          <div className="p-4 rounded-full bg-success mx-auto mb-4 w-fit">
                            <UserPlus className="w-10 h-10 text-success-foreground" />
                          </div>
                          <h3 className="font-semibold text-xl mb-2">Register Patient</h3>
                          <p className="text-sm text-muted-foreground">Add new patients to the system</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-primary">Register New Patient</DialogTitle>
                        <DialogDescription>Enter patient details to register them in the system</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Patient Registration");}} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="patientId">Patient ID</Label>
                            <Input id="patientId" placeholder="P001 (Auto-generated)" disabled className="bg-muted" />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="patientName">Full Name *</Label>
                            <Input id="patientName" placeholder="Enter patient name" required className="border-primary/20 focus:border-primary" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientDOB">Date of Birth *</Label>
                            <Input id="patientDOB" type="date" required className="border-primary/20 focus:border-primary" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientGender">Gender *</Label>
                            <Select required>
                              <SelectTrigger className="border-primary/20 focus:border-primary">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientPhone">Contact Number *</Label>
                            <Input id="patientPhone" placeholder="Enter phone number" required className="border-primary/20 focus:border-primary" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientEmail">Email</Label>
                            <Input id="patientEmail" type="email" placeholder="Enter email" className="border-primary/20 focus:border-primary" />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="patientAddress">Address *</Label>
                            <Input id="patientAddress" placeholder="Enter address" required className="border-primary/20 focus:border-primary" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientNIC">NIC/Passport Number *</Label>
                            <Input id="patientNIC" placeholder="Enter NIC or Passport number" required className="border-primary/20 focus:border-primary" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                            <Input id="emergencyContact" placeholder="Enter emergency contact number" required className="border-primary/20 focus:border-primary" />
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                          Register Patient
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Doctor Management
                </CardTitle>
                <CardDescription>View doctor information and schedules</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* View Doctor List */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <User className="h-6 w-6" />
                        View Doctor List
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Doctor List</DialogTitle>
                        <DialogDescription>Complete list of doctors and their information</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Doctor ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>NIC</TableHead>
                              <TableHead>Role</TableHead>
                              <TableHead>Specialization</TableHead>
                              <TableHead>Contact Number</TableHead>
                              <TableHead>Email</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>D001</TableCell>
                              <TableCell>Dr. John Smith</TableCell>
                              <TableCell>123456789V</TableCell>
                              <TableCell>Senior Consultant</TableCell>
                              <TableCell>Cardiology</TableCell>
                              <TableCell>+94 77 123 4567</TableCell>
                              <TableCell>j.smith@hospital.com</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D002</TableCell>
                              <TableCell>Dr. Sarah Johnson</TableCell>
                              <TableCell>987654321V</TableCell>
                              <TableCell>Consultant</TableCell>
                              <TableCell>Neurology</TableCell>
                              <TableCell>+94 77 234 5678</TableCell>
                              <TableCell>s.johnson@hospital.com</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D003</TableCell>
                              <TableCell>Dr. Michael Williams</TableCell>
                              <TableCell>456789123V</TableCell>
                              <TableCell>Specialist</TableCell>
                              <TableCell>Orthopedics</TableCell>
                              <TableCell>+94 77 345 6789</TableCell>
                              <TableCell>m.williams@hospital.com</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D004</TableCell>
                              <TableCell>Dr. Emily Brown</TableCell>
                              <TableCell>789123456V</TableCell>
                              <TableCell>Consultant</TableCell>
                              <TableCell>Pediatrics</TableCell>
                              <TableCell>+94 77 456 7890</TableCell>
                              <TableCell>e.brown@hospital.com</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D005</TableCell>
                              <TableCell>Dr. David Lee</TableCell>
                              <TableCell>321654987V</TableCell>
                              <TableCell>Senior Specialist</TableCell>
                              <TableCell>Oncology</TableCell>
                              <TableCell>+94 77 567 8901</TableCell>
                              <TableCell>d.lee@hospital.com</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* See Doctor Schedules */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Clock className="h-6 w-6" />
                        See Doctor Schedules
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Doctor Schedules</DialogTitle>
                        <DialogDescription>Current appointments and patient assignments</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Doctor ID</TableHead>
                              <TableHead>Appointment Date & Time</TableHead>
                              <TableHead>Patient Assigned</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>D001</TableCell>
                              <TableCell>2024-01-15 09:00 AM</TableCell>
                              <TableCell>John Doe (P001)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D001</TableCell>
                              <TableCell>2024-01-15 10:30 AM</TableCell>
                              <TableCell>Mary Wilson (P004)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D002</TableCell>
                              <TableCell>2024-01-15 08:00 AM</TableCell>
                              <TableCell>Jane Smith (P002)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D002</TableCell>
                              <TableCell>2024-01-15 11:00 AM</TableCell>
                              <TableCell>Robert Davis (P005)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D003</TableCell>
                              <TableCell>2024-01-15 10:00 AM</TableCell>
                              <TableCell>Bob Johnson (P003)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D003</TableCell>
                              <TableCell>2024-01-15 02:00 PM</TableCell>
                              <TableCell>Lisa Anderson (P006)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D004</TableCell>
                              <TableCell>2024-01-15 09:30 AM</TableCell>
                              <TableCell>Tommy Garcia (P007)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D004</TableCell>
                              <TableCell>2024-01-15 01:00 PM</TableCell>
                              <TableCell>Sophie Martin (P008)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D005</TableCell>
                              <TableCell>2024-01-15 11:30 AM</TableCell>
                              <TableCell>Mark Taylor (P009)</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D005</TableCell>
                              <TableCell>2024-01-15 03:30 PM</TableCell>
                              <TableCell>Emma Thompson (P010)</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Insurance Claims
                </CardTitle>
                <CardDescription>Submit and manage insurance claims</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Submit Claim */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <FileText className="h-6 w-6" />
                        Submit Claim
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Submit Insurance Claim</DialogTitle>
                        <DialogDescription>Enter claim details for processing</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Insurance Claim Submission");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="claimId">Claim ID</Label>
                          <Input id="claimId" placeholder="IC001 (Auto-generated)" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billId">Bill ID</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bill from billing" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="B001">B001 - John Doe - $150.00</SelectItem>
                              <SelectItem value="B002">B002 - Jane Smith - $250.00</SelectItem>
                              <SelectItem value="B003">B003 - Bob Johnson - $300.00</SelectItem>
                              <SelectItem value="B004">B004 - Mary Wilson - $180.00</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insuranceId">Insurance ID</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient insurance" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="INS001">INS001 - HealthCare Plus (John Doe)</SelectItem>
                              <SelectItem value="INS002">INS002 - MediCover Pro (Jane Smith)</SelectItem>
                              <SelectItem value="INS003">INS003 - WellnessCare (Bob Johnson)</SelectItem>
                              <SelectItem value="INS004">INS004 - LifeGuard Insurance (Mary Wilson)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="claimAmount">Claim Amount</Label>
                          <Input id="claimAmount" type="number" placeholder="Enter claim amount" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="submittedDate">Submitted Date</Label>
                          <Input id="submittedDate" type="date" value={new Date().toISOString().split('T')[0]} disabled />
                        </div>
                        <Button type="submit" className="w-full">Submit Claim</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Update Claim Status */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Edit className="h-6 w-6" />
                        Update Claim Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Update Claim Status</DialogTitle>
                        <DialogDescription>Search and update insurance claim status</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Claim Status Update");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="searchClaimId">Search Claim ID</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select claim to update" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IC001">IC001 - John Doe - $150.00</SelectItem>
                              <SelectItem value="IC002">IC002 - Jane Smith - $250.00</SelectItem>
                              <SelectItem value="IC003">IC003 - Bob Johnson - $300.00</SelectItem>
                              <SelectItem value="IC004">IC004 - Mary Wilson - $180.00</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="currentStatus">Current Status</Label>
                          <Input id="currentStatus" placeholder="Pending" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="claimStatus">New Claim Status</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select new status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="statusReason">Status Update Reason</Label>
                          <Input id="statusReason" placeholder="Enter reason for status change" />
                        </div>
                        <Button type="submit" className="w-full">Update Status</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Billing
                </CardTitle>
                <CardDescription>Generate bills and manage payment status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Generate Bill */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <FileText className="h-6 w-6" />
                        Generate Bill
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Generate Bill</DialogTitle>
                        <DialogDescription>Create bill for appointments/treatments</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Bill Generation");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="billId">Bill ID</Label>
                          <Input id="billId" placeholder="B001 (Auto-generated)" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="appointmentId">Appointment ID</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select appointment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="A001">A001 - John Doe - Dr. Smith</SelectItem>
                              <SelectItem value="A002">A002 - Jane Smith - Dr. Johnson</SelectItem>
                              <SelectItem value="A003">A003 - Bob Johnson - Dr. Williams</SelectItem>
                              <SelectItem value="A004">A004 - Mary Wilson - Dr. Brown</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="totalAmount">Total Amount</Label>
                          <Input id="totalAmount" type="number" placeholder="Enter total amount" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="insuredAmount">Insured Amount</Label>
                          <Input id="insuredAmount" type="number" placeholder="Enter insured amount" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientAmount">Patient Amount</Label>
                          <Input id="patientAmount" type="number" placeholder="Enter patient amount" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dueDate">Due Date</Label>
                          <Input id="dueDate" type="date" required />
                        </div>
                        <Button type="submit" className="w-full">Generate Bill</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Mark Payment Status */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <CreditCard className="h-6 w-6" />
                        Mark Payment Status
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Mark Payment Status</DialogTitle>
                        <DialogDescription>Record payment details and update status</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Payment Status Update");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="paymentId">Payment ID</Label>
                          <Input id="paymentId" placeholder="PAY001 (Auto-generated)" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billIdPayment">Bill ID</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bill to mark payment" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="B001">B001 - John Doe - $150.00</SelectItem>
                              <SelectItem value="B002">B002 - Jane Smith - $250.00</SelectItem>
                              <SelectItem value="B003">B003 - Bob Johnson - $300.00</SelectItem>
                              <SelectItem value="B004">B004 - Mary Wilson - $180.00</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="amountPaid">Amount Paid</Label>
                          <Input id="amountPaid" type="number" placeholder="Enter amount paid" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentDateTime">Date & Time</Label>
                          <Input 
                            id="paymentDateTime" 
                            type="datetime-local" 
                            value={new Date().toISOString().slice(0, 16)} 
                            disabled 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentMethod">Payment Method</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="online">Online</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Mark Payment</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

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
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'appointments' 
                ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                : 'hover:bg-muted/50'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs font-medium">Appointments</span>
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'doctors' 
                ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                : 'hover:bg-muted/50'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="text-xs font-medium">Doctors</span>
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'insurance' 
                ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                : 'hover:bg-muted/50'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-xs font-medium">Insurance</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'billing' 
                ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                : 'hover:bg-muted/50'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs font-medium">Billing</span>
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default ReceptionistDashboard;