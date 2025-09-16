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
import { Calendar as CalendarIcon, Users, UserPlus, Search, Stethoscope, FileText, DollarSign, Clock, User, Eye, Edit, CreditCard, CalendarDays, X, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const { toast } = useToast();
  
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Receptionist Dashboard</h1>
          <p className="text-muted-foreground">Manage appointments, patients, and administrative tasks</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="doctors">Doctors</TabsTrigger>
            <TabsTrigger value="insurance">Insurance</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Appointment Management
                </CardTitle>
                <CardDescription>Book, cancel, reschedule appointments and manage doctor assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Book Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <CalendarDays className="h-6 w-6" />
                        Book Appointment
                      </Button>
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

                  {/* Cancel Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col" variant="destructive">
                        <X className="h-6 w-6" />
                        Cancel Appointment
                      </Button>
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
                        <Button type="submit" className="w-full" variant="destructive">Cancel Appointment</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Reschedule Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col" variant="secondary">
                        <CheckCircle className="h-6 w-6" />
                        Reschedule Appointment
                      </Button>
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

                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patient Management
                </CardTitle>
                <CardDescription>Register new patients, update details, and search patient history</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Register Patient */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <UserPlus className="h-6 w-6" />
                        Register Patient
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Register New Patient</DialogTitle>
                        <DialogDescription>Enter patient details to register</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Patient Registration");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientId">Patient ID</Label>
                          <Input id="patientId" placeholder="P001 (Auto-generated)" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientName">Full Name</Label>
                          <Input id="patientName" placeholder="Enter patient name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientDOB">Date of Birth</Label>
                          <Input id="patientDOB" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientGender">Gender</Label>
                          <Select required>
                            <SelectTrigger>
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
                          <Label htmlFor="patientPhone">Contact Number</Label>
                          <Input id="patientPhone" placeholder="Enter phone number" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientEmail">Email</Label>
                          <Input id="patientEmail" type="email" placeholder="Enter email" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientAddress">Address</Label>
                          <Input id="patientAddress" placeholder="Enter address" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientNIC">NIC/Passport Number</Label>
                          <Input id="patientNIC" placeholder="Enter NIC or Passport number" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact">Emergency Contact</Label>
                          <Input id="emergencyContact" placeholder="Enter emergency contact number" required />
                        </div>
                        <Button type="submit" className="w-full">Register Patient</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Update Patient Details */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Edit className="h-6 w-6" />
                        Update Patient Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Update Patient Details</DialogTitle>
                        <DialogDescription>Search and update patient information</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Patient Update");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="searchPatient">Search Patient</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Search by Patient ID or NIC" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="P001">P001 - John Doe (NIC: 123456789V)</SelectItem>
                              <SelectItem value="P002">P002 - Jane Smith (NIC: 987654321V)</SelectItem>
                              <SelectItem value="P003">P003 - Bob Johnson (NIC: 456789123V)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatePatientId">Patient ID</Label>
                          <Input id="updatePatientId" placeholder="P001" disabled />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatePatientName">Full Name</Label>
                          <Input id="updatePatientName" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatePatientDOB">Date of Birth</Label>
                          <Input id="updatePatientDOB" type="date" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatePatientGender">Gender</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Male" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatePatientPhone">Contact Number</Label>
                          <Input id="updatePatientPhone" placeholder="+1234567890" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatePatientEmail">Email</Label>
                          <Input id="updatePatientEmail" type="email" placeholder="john.doe@email.com" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatePatientAddress">Address</Label>
                          <Input id="updatePatientAddress" placeholder="123 Main St, City" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updatePatientNIC">NIC/Passport Number</Label>
                          <Input id="updatePatientNIC" placeholder="123456789V" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="updateEmergencyContact">Emergency Contact</Label>
                          <Input id="updateEmergencyContact" placeholder="+1234567890" />
                        </div>
                        <Button type="submit" className="w-full">Update Patient</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Search Patient History */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Search className="h-6 w-6" />
                        Search Patient History
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Patient History</DialogTitle>
                        <DialogDescription>View comprehensive patient medical history</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="historySearch">Search Patient</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select patient to view history" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="P001">P001 - John Doe</SelectItem>
                              <SelectItem value="P002">P002 - Jane Smith</SelectItem>
                              <SelectItem value="P003">P003 - Bob Johnson</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Appointment History */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Appointment History</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Status</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>2024-01-15</TableCell>
                                <TableCell>Dr. Smith - Cardiology</TableCell>
                                <TableCell>Completed</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2024-01-22</TableCell>
                                <TableCell>Dr. Johnson - Neurology</TableCell>
                                <TableCell>Completed</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* Consultation Notes */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Consultation Notes</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Diagnosis</TableHead>
                                <TableHead>Prescription</TableHead>
                                <TableHead>Notes</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>2024-01-15</TableCell>
                                <TableCell>Hypertension</TableCell>
                                <TableCell>Amlodipine 5mg</TableCell>
                                <TableCell>Follow up in 2 weeks</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2024-01-22</TableCell>
                                <TableCell>Migraine</TableCell>
                                <TableCell>Sumatriptan 50mg</TableCell>
                                <TableCell>Avoid stress triggers</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>

                        {/* Lab Reports */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Lab Reports</h4>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>Test Type</TableHead>
                                <TableHead>Report Link</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell>2024-01-10</TableCell>
                                <TableCell>Blood Work - Complete Panel</TableCell>
                                <TableCell>
                                  <Button variant="link" className="p-0 h-auto">
                                    View Report
                                  </Button>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>2024-01-20</TableCell>
                                <TableCell>MRI Brain Scan</TableCell>
                                <TableCell>
                                  <Button variant="link" className="p-0 h-auto">
                                    View Report
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </div>
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
      </div>
    </div>
  );
};

export default ReceptionistDashboard;