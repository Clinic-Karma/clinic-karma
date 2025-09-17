import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Users, 
  UserPlus, 
  Filter,
  Stethoscope,
  Settings,
  Home,
  Bell,
  LogOut,
  User
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const BranchManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("doctor-management");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [showDoctorRegistration, setShowDoctorRegistration] = useState(false);
  const [showStaffRegistration, setShowStaffRegistration] = useState(false);
  const isMobile = useIsMobile();

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
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className={`relative container mx-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-8'}`}>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Branch Manager Dashboard</h1>
              <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>Manage doctors and staff roles</p>
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
                  onClick={() => setActiveTab('doctor-management')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'doctor-management' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'doctor-management' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Doctor Management</span>
                </button>
                <button
                  onClick={() => setActiveTab('role-management')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'role-management' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'role-management' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Role Management</span>
                </button>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

            <TabsContent value="doctor-management" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Doctor Management</h2>
                  <p className="text-muted-foreground">Register new doctors and manage existing ones</p>
                </div>
                <Button onClick={() => setShowDoctorRegistration(true)} className={`flex items-center gap-2 ${isMobile ? 'px-3 py-2' : 'px-4 py-2'} bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105`}>
                  <UserPlus className="w-4 h-4" />
                  {!isMobile && "Doctor Registration"}
                </Button>
              </div>

              {/* Filters */}
              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <Filter className="w-5 h-5 text-primary-foreground" />
                    </div>
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-4'}`}>
                    <div className="space-y-2">
                      <Label htmlFor="doctorSearch">Search Doctors</Label>
                      <Input
                        id="doctorSearch"
                        placeholder="Search by name..."
                        value={doctorFilter}
                        onChange={(e) => setDoctorFilter(e.target.value)}
                        className="border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specializationFilter">Specialization</Label>
                      <Select value={specializationFilter} onValueChange={setSpecializationFilter}>
                        <SelectTrigger className="border-border/50 focus:border-primary">
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
              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-secondary">
                      <Stethoscope className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    Doctors List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={isMobile ? "overflow-x-auto" : ""}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Specialization</TableHead>
                          {!isMobile && <TableHead>Join Date</TableHead>}
                          {!isMobile && <TableHead>Contact</TableHead>}
                          {!isMobile && <TableHead>Email</TableHead>}
                          {!isMobile && <TableHead>NIC</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDoctors.map((doctor) => (
                          <TableRow key={doctor.id}>
                            <TableCell className="font-medium">{doctor.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{doctor.specialization}</Badge>
                            </TableCell>
                            {!isMobile && <TableCell>{doctor.joinDate}</TableCell>}
                            {!isMobile && <TableCell>{doctor.contact}</TableCell>}
                            {!isMobile && <TableCell>{doctor.email}</TableCell>}
                            {!isMobile && <TableCell>{doctor.nic}</TableCell>}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="role-management" className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Role Management</h2>
                  <p className="text-muted-foreground">Register and manage receptionist and lab coordinator roles</p>
                </div>
                <Button onClick={() => setShowStaffRegistration(true)} className={`flex items-center gap-2 ${isMobile ? 'px-3 py-2' : 'px-4 py-2'} bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105`}>
                  <UserPlus className="w-4 h-4" />
                  {!isMobile && "Staff Registration"}
                </Button>
              </div>

              {/* Filters */}
              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <Filter className="w-5 h-5 text-primary-foreground" />
                    </div>
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-2 gap-4'}`}>
                    <div className="space-y-2">
                      <Label htmlFor="nameSearch">Search by Name</Label>
                      <Input
                        id="nameSearch"
                        placeholder="Search by name..."
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                        className="border-border/50 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="roleFilter">Role</Label>
                      <Select value={roleFilter} onValueChange={setRoleFilter}>
                        <SelectTrigger className="border-border/50 focus:border-primary">
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
              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-secondary">
                      <Users className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    Staff List
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={isMobile ? "overflow-x-auto" : ""}>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Role</TableHead>
                          {!isMobile && <TableHead>Join Date</TableHead>}
                          {!isMobile && <TableHead>Contact</TableHead>}
                          {!isMobile && <TableHead>Email</TableHead>}
                          {!isMobile && <TableHead>NIC</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStaff.map((staff) => (
                          <TableRow key={staff.id}>
                            <TableCell className="font-medium">{staff.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{staff.role}</Badge>
                            </TableCell>
                            {!isMobile && <TableCell>{staff.joinDate}</TableCell>}
                            {!isMobile && <TableCell>{staff.contact}</TableCell>}
                            {!isMobile && <TableCell>{staff.email}</TableCell>}
                            {!isMobile && <TableCell>{staff.nic}</TableCell>}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
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
          <div className="grid grid-cols-2 gap-1 p-2">
            <button
              onClick={() => setActiveTab('doctor-management')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                activeTab === 'doctor-management' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Stethoscope className="w-5 h-5" />
              <span className="text-xs font-medium">Doctors</span>
            </button>
            <button
              onClick={() => setActiveTab('role-management')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                activeTab === 'role-management' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="text-xs font-medium">Staff</span>
            </button>
          </div>
        </div>
      )}

      <DoctorRegistrationForm />
      <StaffRegistrationForm />
    </div>
  );
};

export default BranchManagerDashboard;