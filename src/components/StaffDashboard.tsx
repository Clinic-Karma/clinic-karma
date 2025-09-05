import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar, 
  Users, 
  UserCheck, 
  CreditCard, 
  Receipt, 
  TestTube, 
  Upload, 
  Plus, 
  Edit, 
  Eye, 
  Search,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  DollarSign
} from "lucide-react";

interface StaffDashboardProps {
  role: string;
}

const StaffDashboard = ({ role }: StaffDashboardProps) => {
  const [activeTab, setActiveTab] = useState(role === "lab-coordinator" ? "lab-reports" : "appointments");

  // Dummy data
  const appointments = [
    { id: 1, patient: "John Doe", doctor: "Dr. Sarah Johnson", time: "09:00 AM", date: "2024-01-20", status: "Scheduled" },
    { id: 2, patient: "Jane Smith", doctor: "Dr. Michael Chen", time: "10:30 AM", date: "2024-01-20", status: "Confirmed" },
    { id: 3, patient: "Mike Johnson", doctor: "Dr. Emily Davis", time: "02:00 PM", date: "2024-01-20", status: "Completed" },
    { id: 4, patient: "Sarah Wilson", doctor: "Dr. Robert Wilson", time: "03:30 PM", date: "2024-01-20", status: "Cancelled" },
  ];

  const patients = [
    { id: 1, name: "John Doe", nic: "199012345678", phone: "555-0101", lastVisit: "2024-01-15", status: "Active" },
    { id: 2, name: "Jane Smith", nic: "198567891234", phone: "555-0102", lastVisit: "2024-01-18", status: "Active" },
    { id: 3, name: "Mike Johnson", nic: "199234567890", phone: "555-0103", lastVisit: "2024-01-10", status: "Inactive" },
  ];

  const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology", status: "Available", nextSlot: "10:00 AM" },
    { id: 2, name: "Dr. Michael Chen", specialization: "Neurology", status: "Busy", nextSlot: "02:00 PM" },
    { id: 3, name: "Dr. Emily Davis", specialization: "Pediatrics", status: "Available", nextSlot: "11:30 AM" },
  ];

  const labReports = [
    { id: 1, patient: "John Doe", reportType: "Blood Test", date: "2024-01-19", status: "Completed" },
    { id: 2, patient: "Jane Smith", reportType: "X-Ray", date: "2024-01-20", status: "Pending" },
    { id: 3, patient: "Mike Johnson", reportType: "MRI Scan", date: "2024-01-18", status: "Completed" },
  ];

  const insuranceClaims = [
    { id: 1, patient: "John Doe", provider: "Blue Cross", amount: "$250", status: "Approved", date: "2024-01-15" },
    { id: 2, patient: "Jane Smith", provider: "Aetna", amount: "$180", status: "Pending", date: "2024-01-18" },
    { id: 3, patient: "Mike Johnson", provider: "Cigna", amount: "$320", status: "Rejected", date: "2024-01-20" },
  ];

  const bills = [
    { id: 1, patient: "John Doe", service: "Consultation", amount: "$150", status: "Paid", date: "2024-01-20" },
    { id: 2, patient: "Jane Smith", service: "Blood Test", amount: "$80", status: "Unpaid", date: "2024-01-19" },
    { id: 3, patient: "Mike Johnson", service: "X-Ray", amount: "$120", status: "Partially Paid", date: "2024-01-18" },
  ];

  if (role === "lab-coordinator") {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground">Lab Coordinator Dashboard</h2>
          <p className="text-muted-foreground mt-2">Manage laboratory reports and uploads</p>
        </div>

        <div className="text-center py-12">
          <p className="text-muted-foreground">Lab Coordinator dashboard content will be added here.</p>
        </div>
      </div>
    );
  }

  // Receptionist Dashboard
  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Receptionist Dashboard</h2>
        <p className="text-muted-foreground mt-2">Manage appointments, patients, and administrative tasks</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="appointments" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Appointments
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Doctors
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Insurance
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <Receipt className="w-4 h-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <Plus className="w-6 h-6 mb-2" />
                    Book/Cancel/Reschedule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Appointment Management</DialogTitle>
                    <DialogDescription>Book, cancel, or reschedule patient appointments</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="patient-select">Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.name} - {patient.nic}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="doctor-select">Doctor</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select doctor" />
                        </SelectTrigger>
                        <SelectContent>
                          {doctors.map(doctor => (
                            <SelectItem key={doctor.id} value={doctor.id.toString()}>
                              {doctor.name} - {doctor.specialization}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="appointment-date">Date</Label>
                      <Input id="appointment-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="appointment-time">Time</Label>
                      <Input id="appointment-time" type="time" />
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Book</Button>
                      <Button variant="outline" className="flex-1">Cancel</Button>
                      <Button variant="secondary" className="flex-1">Reschedule</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <UserCheck className="w-6 h-6 mb-2" />
                Assign Patient to Doctor
              </Button>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Eye className="w-6 h-6 mb-2" />
                View Doctor Availability
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Manage daily appointment schedule</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">{appointment.patient}</TableCell>
                        <TableCell>{appointment.doctor}</TableCell>
                        <TableCell>{appointment.time}</TableCell>
                        <TableCell>
                          <Badge variant={
                            appointment.status === "Completed" ? "default" :
                            appointment.status === "Confirmed" ? "secondary" :
                            appointment.status === "Cancelled" ? "destructive" : "outline"
                          }>
                            {appointment.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <XCircle className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <Plus className="w-6 h-6 mb-2" />
                    Register Patient
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Register New Patient</DialogTitle>
                    <DialogDescription>Add a new patient to the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="new-patient-name">Full Name</Label>
                      <Input id="new-patient-name" placeholder="Enter patient name" />
                    </div>
                    <div>
                      <Label htmlFor="new-patient-nic">NIC Number</Label>
                      <Input id="new-patient-nic" placeholder="Enter NIC number" />
                    </div>
                    <div>
                      <Label htmlFor="new-patient-phone">Phone Number</Label>
                      <Input id="new-patient-phone" placeholder="Enter phone number" />
                    </div>
                    <div>
                      <Label htmlFor="new-patient-email">Email (Optional)</Label>
                      <Input id="new-patient-email" type="email" placeholder="Enter email address" />
                    </div>
                    <div>
                      <Label htmlFor="new-patient-address">Address</Label>
                      <Textarea id="new-patient-address" placeholder="Enter address" />
                    </div>
                    <Button className="w-full">Register Patient</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Edit className="w-6 h-6 mb-2" />
                Update Patient Details
              </Button>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Search className="w-6 h-6 mb-2" />
                Search Patient History
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Patient Directory</CardTitle>
                <CardDescription>Manage registered patients</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>NIC</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.nic}</TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell>{patient.lastVisit}</TableCell>
                        <TableCell>
                          <Badge variant={patient.status === "Active" ? "default" : "secondary"}>
                            {patient.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="doctors" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <UserCheck className="w-6 h-6 mb-2" />
                View Doctor List
              </Button>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Calendar className="w-6 h-6 mb-2" />
                See Schedules
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Doctor Availability</CardTitle>
                <CardDescription>Current status and next available slots</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Next Available</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell>{doctor.specialization}</TableCell>
                        <TableCell>
                          <Badge variant={doctor.status === "Available" ? "default" : "secondary"}>
                            {doctor.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{doctor.nextSlot}</TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            <Calendar className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <Plus className="w-6 h-6 mb-2" />
                    Submit Claims
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Submit Insurance Claim</DialogTitle>
                    <DialogDescription>Submit a new insurance claim for processing</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="claim-patient">Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="insurance-provider">Insurance Provider</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue-cross">Blue Cross</SelectItem>
                          <SelectItem value="aetna">Aetna</SelectItem>
                          <SelectItem value="cigna">Cigna</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="claim-amount">Claim Amount</Label>
                      <Input id="claim-amount" placeholder="Enter claim amount" />
                    </div>
                    <div>
                      <Label htmlFor="service-type">Service Type</Label>
                      <Input id="service-type" placeholder="Enter service description" />
                    </div>
                    <Button className="w-full">Submit Claim</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Edit className="w-6 h-6 mb-2" />
                Update Status
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Insurance Claims</CardTitle>
                <CardDescription>Track and manage insurance claims</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Provider</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {insuranceClaims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.patient}</TableCell>
                        <TableCell>{claim.provider}</TableCell>
                        <TableCell>{claim.amount}</TableCell>
                        <TableCell>
                          <Badge variant={
                            claim.status === "Approved" ? "default" :
                            claim.status === "Pending" ? "secondary" : "destructive"
                          }>
                            {claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{claim.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="billing" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <FileText className="w-6 h-6 mb-2" />
                    Generate Bills
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Generate Bill</DialogTitle>
                    <DialogDescription>Create a new bill for appointments or treatments</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="bill-patient">Patient</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map(patient => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="service-description">Service Description</Label>
                      <Input id="service-description" placeholder="Enter service details" />
                    </div>
                    <div>
                      <Label htmlFor="bill-amount">Amount</Label>
                      <Input id="bill-amount" placeholder="Enter bill amount" />
                    </div>
                    <div>
                      <Label htmlFor="payment-method">Payment Method</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="card">Credit/Debit Card</SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                          <SelectItem value="partial">Partial Payment</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Generate Bill</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <DollarSign className="w-6 h-6 mb-2" />
                Mark Payment Status
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bills</CardTitle>
                <CardDescription>Track payments and billing status</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.id}>
                        <TableCell className="font-medium">{bill.patient}</TableCell>
                        <TableCell>{bill.service}</TableCell>
                        <TableCell>{bill.amount}</TableCell>
                        <TableCell>
                          <Badge variant={
                            bill.status === "Paid" ? "default" :
                            bill.status === "Partially Paid" ? "secondary" : "destructive"
                          }>
                            {bill.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{bill.date}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StaffDashboard;