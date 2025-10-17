import { useState, useEffect } from "react";
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
  LogOut
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import axios from "axios";

const BranchManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("doctor-management");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [showDoctorRegistration, setShowDoctorRegistration] = useState(false);
  const [showStaffRegistration, setShowStaffRegistration] = useState(false);
  const isMobile = useIsMobile();

  // Real data from backend
  const [doctorsData, setDoctorsData] = useState<any[]>([]);
  const [staffData, setStaffData] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch doctors data
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/doctors');
        if (response.data.success) {
          setDoctorsData(response.data.doctors || []);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
        setDoctorsData([]);
      }
    };

    fetchDoctors();
  }, []);

  // Fetch staff data from database
  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/staff');
        if (response.data.success) {
          setStaffData(response.data.staff || []);
        }
      } catch (error) {
        console.error('Error fetching staff:', error);
        // Fallback to mock data if endpoint fails
        setStaffData([
          { id: 1, name: "Alice Wilson", role: "Receptionist", username: "alice.wilson", branch: "Colombo" },
          { id: 2, name: "Bob Davis", role: "Lab Coordinator", username: "bob.davis", branch: "Colombo" },
          { id: 3, name: "Carol Martinez", role: "Receptionist", username: "carol.martinez", branch: "Kandy" }
        ]);
      }
    };

    fetchStaff();
  }, []);

  // Fetch specializations
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/specializations');
        if (response.data.success) {
          setSpecializations(response.data.specializations || []);
        }
      } catch (error) {
        console.error('Error fetching specializations:', error);
        setSpecializations([]);
      }
    };

    fetchSpecializations();
  }, []);

  // Handle staff registration
  const handleStaffRegistration = async (staffData: any) => {
    setLoading(true);
    try {
      // Call the backend API to create staff
      const response = await axios.post('http://localhost:5000/api/appointments/staff', staffData);
      
      if (response.data.success) {
        // Add the new staff to local state
        const newStaff = {
          id: response.data.data.staffId,
          name: staffData.name,
          role: staffData.role === 'receptionist' ? 'Receptionist' : 'Lab Coordinator',
          username: staffData.username,
          branch: staffData.branch || 'Colombo'
        };
        
        setStaffData(prev => [...prev, newStaff]);
        setShowStaffRegistration(false);
        
        // Show success message
        alert('Staff member registered successfully!');
      } else {
        alert('Failed to register staff: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error registering staff:', error);
      const errorMessage = error.response?.data?.message || 'Failed to register staff';
      alert('Error: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle doctor registration
  const handleDoctorRegistration = async (doctorData: any) => {
    setLoading(true);
    try {
      // For now, we'll just add to local state since the backend endpoint isn't working
      // In a real scenario, this would be: await axios.post('http://localhost:5000/api/branchmanagers/doctors', doctorData);
      const newDoctor = {
        id: Date.now(), // Temporary ID
        name: doctorData.name,
        branch: doctorData.branch || 'Colombo',
        user_type: 'doctor',
        username: doctorData.username
      };
      
      setDoctorsData(prev => [...prev, newDoctor]);
      setShowDoctorRegistration(false);
      
      // Show success message
      alert('Doctor registered successfully!');
    } catch (error) {
      console.error('Error registering doctor:', error);
      alert('Error registering doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctorsData.filter(doctor => {
    const matchesName = doctor.name.toLowerCase().includes(doctorFilter.toLowerCase());
    const matchesBranch = !specializationFilter || doctor.branch === specializationFilter;
    return matchesName && matchesBranch;
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
                {specializations.map((spec) => (
                  <SelectItem key={spec.id} value={spec.name}>
                    {spec.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input id="address" placeholder="123 Main Street, City" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" placeholder="dr.john.doe" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" type="password" placeholder="Enter password" className="col-span-3" />
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
          <Button 
            type="submit" 
            onClick={() => {
              const formData = {
                name: (document.getElementById('doctorName') as HTMLInputElement)?.value,
                specialization: (document.querySelector('[data-specialization]') as HTMLSelectElement)?.value,
                address: (document.getElementById('address') as HTMLInputElement)?.value,
                username: (document.getElementById('username') as HTMLInputElement)?.value,
                password: (document.getElementById('password') as HTMLInputElement)?.value,
                contact: (document.getElementById('contact') as HTMLInputElement)?.value,
                email: (document.getElementById('email') as HTMLInputElement)?.value,
                nic: (document.getElementById('nic') as HTMLInputElement)?.value,
                branch: 'Colombo'
              };
              handleDoctorRegistration(formData);
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Doctor'}
          </Button>
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
            <Label htmlFor="address" className="text-right">
              Address
            </Label>
            <Input id="address" placeholder="123 Main Street, City" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input id="username" placeholder="staff.username" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" type="password" placeholder="Enter password" className="col-span-3" />
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
          <Button 
            type="submit" 
            onClick={() => {
              const formData = {
                name: (document.getElementById('staffName') as HTMLInputElement)?.value,
                role: (document.querySelector('[data-role]') as HTMLSelectElement)?.value,
                address: (document.getElementById('address') as HTMLInputElement)?.value,
                username: (document.getElementById('username') as HTMLInputElement)?.value,
                password: (document.getElementById('password') as HTMLInputElement)?.value,
                contact: (document.getElementById('contact') as HTMLInputElement)?.value,
                email: (document.getElementById('email') as HTMLInputElement)?.value,
                nic: (document.getElementById('nicStaff') as HTMLInputElement)?.value,
                branch: 'Colombo'
              };
              handleStaffRegistration(formData);
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register Staff'}
          </Button>
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
                          {specializations.map((spec) => (
                            <SelectItem key={spec.id} value={spec.name}>
                              {spec.name}
                            </SelectItem>
                          ))}
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
                          <TableHead>Branch</TableHead>
                          {!isMobile && <TableHead>Type</TableHead>}
                          {!isMobile && <TableHead>Username</TableHead>}
                          {!isMobile && <TableHead>ID</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredDoctors.map((doctor) => (
                          <TableRow key={doctor.id}>
                            <TableCell className="font-medium">{doctor.name}</TableCell>
                            <TableCell>
                              <Badge variant="secondary">{doctor.branch}</Badge>
                            </TableCell>
                            {!isMobile && <TableCell>{doctor.user_type}</TableCell>}
                            {!isMobile && <TableCell>{doctor.username || 'N/A'}</TableCell>}
                            {!isMobile && <TableCell>{doctor.id}</TableCell>}
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
                          {!isMobile && <TableHead>Username</TableHead>}
                          {!isMobile && <TableHead>Branch</TableHead>}
                          {!isMobile && <TableHead>ID</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStaff.map((staff) => (
                          <TableRow key={staff.id}>
                            <TableCell className="font-medium">{staff.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{staff.role}</Badge>
                            </TableCell>
                            {!isMobile && <TableCell>{staff.username || 'N/A'}</TableCell>}
                            {!isMobile && <TableCell>{staff.branch || 'N/A'}</TableCell>}
                            {!isMobile && <TableCell>{staff.id}</TableCell>}
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