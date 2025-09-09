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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <UserPlus className="h-6 w-6" />
                        Register Patient
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Register New Patient</DialogTitle>
                        <DialogDescription>Enter patient details to register</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Patient Registration");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="patientName">Full Name</Label>
                          <Input id="patientName" placeholder="Enter patient name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientAge">Age</Label>
                          <Input id="patientAge" type="number" placeholder="Enter age" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="patientPhone">Phone Number</Label>
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
                        <Button type="submit" className="w-full">Register Patient</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button className="flex items-center gap-2 h-20 flex-col">
                    <Edit className="h-6 w-6" />
                    Update Patient Details
                  </Button>
                  <Button className="flex items-center gap-2 h-20 flex-col">
                    <Search className="h-6 w-6" />
                    Search Patient History
                  </Button>
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
                  <Button className="flex items-center gap-2 h-20 flex-col">
                    <User className="h-6 w-6" />
                    View Doctor List
                  </Button>
                  <Button className="flex items-center gap-2 h-20 flex-col">
                    <Clock className="h-6 w-6" />
                    See Schedules
                  </Button>
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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <FileText className="h-6 w-6" />
                        Submit Claims
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Submit Insurance Claim</DialogTitle>
                        <DialogDescription>Enter claim details</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Insurance Claim Submission");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="claimPatient">Patient Name</Label>
                          <Input id="claimPatient" placeholder="Enter patient name" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="claimAmount">Claim Amount</Label>
                          <Input id="claimAmount" type="number" placeholder="Enter claim amount" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="claimType">Claim Type</Label>
                          <Select required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select claim type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="consultation">Consultation</SelectItem>
                              <SelectItem value="procedure">Procedure</SelectItem>
                              <SelectItem value="medication">Medication</SelectItem>
                              <SelectItem value="lab">Lab Tests</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Submit Claim</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                  <Button className="flex items-center gap-2 h-20 flex-col">
                    <Edit className="h-6 w-6" />
                    Update Status
                  </Button>
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