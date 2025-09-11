import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Users, 
  UserPlus, 
  Filter,
  Stethoscope,
  Settings,
  LogOut
} from "lucide-react";

const BranchManagerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("doctor-management");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [showDoctorRegistration, setShowDoctorRegistration] = useState(false);
  const [showStaffRegistration, setShowStaffRegistration] = useState(false);

  // Sample doctors data
  const doctorsData = [
    { id: 1, name: "Dr. John Smith", specialization: "Cardiology", joinDate: "2023-01-15", contact: "555-0101", email: "john.smith@hospital.com", nic: "199012345678" },
    { id: 2, name: "Dr. Sarah Johnson", specialization: "Pediatrics", joinDate: "2023-02-20", contact: "555-0102", email: "sarah.johnson@hospital.com", nic: "198512345679" },
    { id: 3, name: "Dr. Mike Brown", specialization: "Orthopedics", joinDate: "2023-03-10", contact: "555-0103", email: "mike.brown@hospital.com", nic: "199212345680" }
  ];

  // Sample staff data
  const staffData = [
    { id: 1, name: "Alice Wilson", role: "Receptionist", joinDate: "2023-01-10", contact: "555-0201", email: "alice.wilson@hospital.com", nic: "199112345681" },
    { id: 2, name: "Bob Davis", role: "Lab Coordinator", joinDate: "2023-02-15", contact: "555-0202", email: "bob.davis@hospital.com", nic: "198812345682" },
    { id: 3, name: "Carol Martinez", role: "Receptionist", joinDate: "2023-03-05", contact: "555-0203", email: "carol.martinez@hospital.com", nic: "199312345683" }
  ];

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesName = doctor.name.toLowerCase().includes(doctorFilter.toLowerCase());
    const matchesSpecialization = !specializationFilter || doctor.specialization === specializationFilter;
    return matchesName && matchesSpecialization;
  });

  const filteredStaff = staffData.filter(staff => {
    const matchesName = staff.name.toLowerCase().includes(nameFilter.toLowerCase());
    const matchesRole = !roleFilter || staff.role === roleFilter;
    return matchesName && matchesRole;
  });

  const DoctorRegistrationForm = () => (
    <Dialog open={showDoctorRegistration} onOpenChange={setShowDoctorRegistration}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Doctor Registration</DialogTitle>
          <DialogDescription>
            Register a new doctor in the system.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="doctorName" className="text-right">
              Name
            </Label>
            <Input id="doctorName" placeholder="Dr. John Doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="specialization" className="text-right">
              Specialization
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select specialization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cardiology">Cardiology</SelectItem>
                <SelectItem value="pediatrics">Pediatrics</SelectItem>
                <SelectItem value="orthopedics">Orthopedics</SelectItem>
                <SelectItem value="neurology">Neurology</SelectItem>
                <SelectItem value="dermatology">Dermatology</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="joinDate" className="text-right">
              Join Date
            </Label>
            <Input id="joinDate" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact
            </Label>
            <Input id="contact" placeholder="555-0000" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" placeholder="doctor@hospital.com" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nic" className="text-right">
              NIC No
            </Label>
            <Input id="nic" placeholder="199012345678" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Register Doctor</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  const StaffRegistrationForm = () => (
    <Dialog open={showStaffRegistration} onOpenChange={setShowStaffRegistration}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Staff Registration</DialogTitle>
          <DialogDescription>
            Register new receptionist or lab coordinator.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="staffName" className="text-right">
              Name
            </Label>
            <Input id="staffName" placeholder="John Smith" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="receptionist">Receptionist</SelectItem>
                <SelectItem value="lab-coordinator">Lab Coordinator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="joinDate" className="text-right">
              Join Date
            </Label>
            <Input id="joinDate" type="date" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact
            </Label>
            <Input id="contact" placeholder="555-0000" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" placeholder="staff@hospital.com" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nicStaff" className="text-right">
              NIC No
            </Label>
            <Input id="nicStaff" placeholder="199012345678" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Register Staff</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Branch Manager Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage doctors and staff roles</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="doctor-management" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Doctor Management
            </TabsTrigger>
            <TabsTrigger value="role-management" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Role Management
            </TabsTrigger>
            <TabsTrigger value="administration" className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              Administration
            </TabsTrigger>
          </TabsList>

          <TabsContent value="doctor-management" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Doctor Management</h2>
                <Button onClick={() => setShowDoctorRegistration(true)} className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Doctor Registration
                </Button>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="doctorSearch">Search Doctors</Label>
                      <Input
                        id="doctorSearch"
                        placeholder="Search by name..."
                        value={doctorFilter}
                        onChange={(e) => setDoctorFilter(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specializationFilter">Specialization</Label>
                      <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All specializations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All specializations</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Doctors Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Doctors List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>NIC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDoctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.name}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{doctor.specialization}</Badge>
                          </TableCell>
                          <TableCell>{doctor.joinDate}</TableCell>
                          <TableCell>{doctor.contact}</TableCell>
                          <TableCell>{doctor.email}</TableCell>
                          <TableCell>{doctor.nic}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="role-management" className="mt-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Role Management</h2>
                <Button onClick={() => setShowStaffRegistration(true)} className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Receptionist/Lab Coordinator Registration
                </Button>
              </div>

              {/* Filters */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nameSearch">Search by Name</Label>
                      <Input
                        id="nameSearch"
                        placeholder="Search by name..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleFilter">Role</Label>
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="All roles" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All roles</SelectItem>
                          <SelectItem value="Receptionist">Receptionist</SelectItem>
                          <SelectItem value="Lab Coordinator">Lab Coordinator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Staff Table */}
              <Card>
                <CardHeader>
                  <CardTitle>Staff List</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>NIC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredStaff.map((staff) => (
                        <TableRow key={staff.id}>
                          <TableCell className="font-medium">{staff.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{staff.role}</Badge>
                          </TableCell>
                          <TableCell>{staff.joinDate}</TableCell>
                          <TableCell>{staff.contact}</TableCell>
                          <TableCell>{staff.email}</TableCell>
                          <TableCell>{staff.nic}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="administration" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Administration</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-primary" />
                    Change Login
                  </CardTitle>
                  <CardDescription>Return to the administration login page to change your login</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate("/")} className="w-full">
                    Go to Administration Login
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        <DoctorRegistrationForm />
        <StaffRegistrationForm />
      </div>
    </div>
  );
};

export default BranchManagerDashboard;