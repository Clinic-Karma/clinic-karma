import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Users, UserPlus, Search, Stethoscope, FileText, DollarSign, Clock, User, Eye, Edit, CreditCard, CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const { toast } = useToast();

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
                  
                  {/* Book/Cancel/Reschedule Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Calendar className="h-6 w-6" />
                        Book/Cancel/Reschedule
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Appointment Management</DialogTitle>
                        <DialogDescription>Book, cancel, or reschedule appointments</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Appointment Management");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="appointmentId">Appointment ID</Label>
                          <Input id="appointmentId" placeholder="Auto-generated for new booking" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientSearch">Patient ID</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Search by ID, Name, or NIC" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="P001">P001 - John Doe (NIC: 123456789V)</SelectItem>
                              <SelectItem value="P002">P002 - Jane Smith (NIC: 987654321V)</SelectItem>
                              <SelectItem value="P003">P003 - Bob Johnson (NIC: 456789123V)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="appointmentDate">Appointment Date</Label>
                          <Input id="appointmentDate" type="date" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="appointmentStatus">Status</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scheduled">Scheduled</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                              <SelectItem value="rescheduled">Rescheduled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Update Appointment</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Assign Patient to Doctor */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Users className="h-6 w-6" />
                        Assign Patient to Doctor
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Assign Patient to Doctor</DialogTitle>
                        <DialogDescription>Assign a patient to a doctor for treatment</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Patient Assignment");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="assignAppointmentId">Appointment ID</Label>
                          <Input id="assignAppointmentId" placeholder="Enter appointment ID" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="assignPatientId">Patient ID</Label>
                          <Input id="assignPatientId" placeholder="Enter patient ID" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="doctorSpecialization">Doctor by Specialization</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="D001">Dr. Smith - Cardiology</SelectItem>
                              <SelectItem value="D002">Dr. Johnson - Neurology</SelectItem>
                              <SelectItem value="D003">Dr. Williams - Orthopedics</SelectItem>
                              <SelectItem value="D004">Dr. Brown - Pediatrics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Input id="startTime" type="time" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="appointmentType">Type</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="emergency">Emergency</SelectItem>
                              <SelectItem value="regular">Regular</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Assign Patient</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* View Doctor Availability */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <Eye className="h-6 w-6" />
                        View Doctor Availability
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Doctor Availability</DialogTitle>
                        <DialogDescription>View available time slots for all doctors</DialogDescription>
                      </DialogHeader>
                      <div className="mt-4">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Doctor ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Specialization</TableHead>
                              <TableHead>Available Time Slots</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>D001</TableCell>
                              <TableCell>Dr. Smith</TableCell>
                              <TableCell>Cardiology</TableCell>
                              <TableCell>09:00-12:00, 14:00-17:00</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D002</TableCell>
                              <TableCell>Dr. Johnson</TableCell>
                              <TableCell>Neurology</TableCell>
                              <TableCell>08:00-11:00, 13:00-16:00</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D003</TableCell>
                              <TableCell>Dr. Williams</TableCell>
                              <TableCell>Orthopedics</TableCell>
                              <TableCell>10:00-13:00, 15:00-18:00</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>D004</TableCell>
                              <TableCell>Dr. Brown</TableCell>
                              <TableCell>Pediatrics</TableCell>
                              <TableCell>09:00-12:00, 14:00-16:00</TableCell>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <FileText className="h-6 w-6" />
                        Generate Bills
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Generate Bill</DialogTitle>
                        <DialogDescription>Create bill for appointments/treatments</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Bill Generation");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="billPatient">Patient Name</Label>
                          <Input id="billPatient" placeholder="Enter patient name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billService">Service Type</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select service" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultation">Consultation</SelectItem>
                              <SelectItem value="treatment">Treatment</SelectItem>
                              <SelectItem value="procedure">Procedure</SelectItem>
                              <SelectItem value="lab">Lab Tests</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="billAmount">Amount</Label>
                          <Input id="billAmount" type="number" placeholder="Enter amount" required />
                        </div>
                        <Button type="submit" className="w-full">Generate Bill</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button className="flex items-center gap-2 h-20 flex-col">
                    <CreditCard className="h-6 w-6" />
                    Mark Payment Status
                  </Button>
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