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
import { UserCheck, Users, Plus, Filter, Search, Edit, Eye, Trash2, Calendar } from "lucide-react";

const BranchManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("doctors");
  const [doctorFilter, setDoctorFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiology", joined: "2023-01-15", contact: "555-0101", email: "sarah.j@medsync.com", nic: "199012345678", status: "Active" },
    { id: 2, name: "Dr. Michael Chen", specialization: "Neurology", joined: "2023-03-20", contact: "555-0102", email: "michael.c@medsync.com", nic: "198567891234", status: "Active" },
    { id: 3, name: "Dr. Emily Davis", specialization: "Pediatrics", joined: "2022-11-10", contact: "555-0103", email: "emily.d@medsync.com", nic: "199234567890", status: "On Leave" },
    { id: 4, name: "Dr. Robert Wilson", specialization: "Orthopedics", joined: "2023-06-05", contact: "555-0104", email: "robert.w@medsync.com", nic: "197845612378", status: "Active" },
    { id: 5, name: "Dr. Lisa Thompson", specialization: "Dermatology", joined: "2023-02-28", contact: "555-0105", email: "lisa.t@medsync.com", nic: "199556789123", status: "Active" },
  ];

  const staff = [
    { id: 1, name: "Alice Johnson", role: "Receptionist", joined: "2023-04-10", contact: "555-0201", email: "alice.j@medsync.com", nic: "199123456789" },
    { id: 2, name: "Bob Smith", role: "Lab Coordinator", joined: "2023-05-15", contact: "555-0202", email: "bob.s@medsync.com", nic: "198765432109" },
    { id: 3, name: "Carol Davis", role: "Receptionist", joined: "2023-03-22", contact: "555-0203", email: "carol.d@medsync.com", nic: "199987654321" },
    { id: 4, name: "David Wilson", role: "Lab Coordinator", joined: "2023-06-01", contact: "555-0204", email: "david.w@medsync.com", nic: "197654321098" },
    { id: 5, name: "Emma Brown", role: "Receptionist", joined: "2023-02-14", contact: "555-0205", email: "emma.b@medsync.com", nic: "199876543210" },
  ];

  const specializations = [...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = doctors.filter(doctor => {
    if (doctorFilter === "doctors") return true;
    if (doctorFilter === "specialization") return true;
    return true;
  });

  const filteredStaff = staff.filter(member => {
    const nameMatch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const roleMatch = roleFilter === "" || member.role === roleFilter;
    return nameMatch && roleMatch;
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Branch Manager Dashboard</h2>
        <p className="text-muted-foreground mt-2">Manage doctors and staff roles</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Doctor Management
          </TabsTrigger>
          <TabsTrigger value="roles" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Role Management
          </TabsTrigger>
        </TabsList>

        <TabsContent value="doctors" className="mt-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant={doctorFilter === "all" ? "default" : "outline"}
                  onClick={() => setDoctorFilter("all")}
                  size="sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All Doctors
                </Button>
                <Button 
                  variant={doctorFilter === "doctors" ? "default" : "outline"}
                  onClick={() => setDoctorFilter("doctors")}
                  size="sm"
                >
                  Doctors
                </Button>
                <Button 
                  variant={doctorFilter === "specialization" ? "default" : "outline"}
                  onClick={() => setDoctorFilter("specialization")}
                  size="sm"
                >
                  Specialization Wise
                </Button>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Doctor Registration
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Doctor Registration</DialogTitle>
                    <DialogDescription>Add a new doctor to the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="doctor-name">Doctor's Name</Label>
                      <Input id="doctor-name" placeholder="Enter doctor's full name" />
                    </div>
                    <div>
                      <Label htmlFor="specialization">Specialization Field</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="orthopedics">Orthopedics</SelectItem>
                          <SelectItem value="dermatology">Dermatology</SelectItem>
                          <SelectItem value="emergency">Emergency Medicine</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="joined-date">Joined Date</Label>
                      <Input id="joined-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="contact-no">Contact No</Label>
                      <Input id="contact-no" placeholder="Enter contact number" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="Enter email address" />
                    </div>
                    <div>
                      <Label htmlFor="nic-no">NIC No</Label>
                      <Input id="nic-no" placeholder="Enter NIC number" />
                    </div>
                    <Button className="w-full">Register Doctor</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {doctorFilter === "specialization" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specializations.map((spec, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{spec}</CardTitle>
                      <CardDescription>
                        {doctors.filter(d => d.specialization === spec).length} doctors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {doctors.filter(d => d.specialization === spec).map(doctor => (
                          <div key={doctor.id} className="flex items-center justify-between">
                            <span className="text-sm">{doctor.name}</span>
                            <Badge variant={doctor.status === "Active" ? "default" : "secondary"}>
                              {doctor.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {doctorFilter !== "specialization" && (
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Joined Date</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDoctors.map((doctor) => (
                        <TableRow key={doctor.id}>
                          <TableCell className="font-medium">{doctor.name}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.joined}</TableCell>
                          <TableCell>{doctor.contact}</TableCell>
                          <TableCell>
                            <Badge variant={doctor.status === "Active" ? "default" : "secondary"}>
                              {doctor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Calendar className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="roles" className="mt-6">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Filter by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-48"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Roles</SelectItem>
                    <SelectItem value="Receptionist">Receptionist</SelectItem>
                    <SelectItem value="Lab Coordinator">Lab Coordinator</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Receptionist/Lab Coordinator Registration
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Staff Registration</DialogTitle>
                    <DialogDescription>Add a new receptionist or lab coordinator</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="staff-name">Name</Label>
                      <Input id="staff-name" placeholder="Enter full name" />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="receptionist">Receptionist</SelectItem>
                          <SelectItem value="lab-coordinator">Lab Coordinator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="staff-joined-date">Joined Date</Label>
                      <Input id="staff-joined-date" type="date" />
                    </div>
                    <div>
                      <Label htmlFor="staff-contact">Contact No</Label>
                      <Input id="staff-contact" placeholder="Enter contact number" />
                    </div>
                    <div>
                      <Label htmlFor="staff-email">Email</Label>
                      <Input id="staff-email" type="email" placeholder="Enter email address" />
                    </div>
                    <div>
                      <Label htmlFor="staff-nic">NIC No</Label>
                      <Input id="staff-nic" placeholder="Enter NIC number" />
                    </div>
                    <Button className="w-full">Register Staff Member</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Overview</CardTitle>
                  <CardDescription>Current staff distribution</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Receptionists</span>
                    <Badge variant="secondary">
                      {staff.filter(s => s.role === "Receptionist").length} staff
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lab Coordinators</span>
                    <Badge variant="secondary">
                      {staff.filter(s => s.role === "Lab Coordinator").length} staff
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total Staff</span>
                    <Badge variant="default">{staff.length} members</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Additions</CardTitle>
                  <CardDescription>Recently registered staff</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {staff.slice(0, 3).map((member) => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                      <Badge variant="outline">{member.joined}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Staff Directory</CardTitle>
                <CardDescription>All registered staff members</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Joined Date</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStaff.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.name}</TableCell>
                        <TableCell>
                          <Badge variant={member.role === "Receptionist" ? "default" : "secondary"}>
                            {member.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{member.joined}</TableCell>
                        <TableCell>{member.contact}</TableCell>
                        <TableCell>{member.email}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
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

export default BranchManagerDashboard;