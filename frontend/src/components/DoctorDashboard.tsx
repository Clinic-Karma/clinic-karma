  import { useState } from 'react';
  import { Button } from '@/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
  import { Badge } from '@/components/ui/badge';
  import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
  import { Input } from '@/components/ui/input';
  import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
  import PatientDetails from './PatientDetails';

  import { 
    Calendar,
    Users,
    Settings,
    Search,
    Clock,
    Phone,
    Mail,
    FileText,
    CheckCircle,
    XCircle,
    AlertCircle,
    BarChart3,
    TrendingUp,
    Home,
    Bell,
    LogOut,
    User,
    Activity,
    Stethoscope
  } from 'lucide-react';
  import { useIsMobile } from '@/hooks/use-mobile';

  import { useEffect } from 'react';
import axios from 'axios';
  
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite



  const DoctorDashboard = () => {
    const [activeTab, setActiveTab] = useState('appointments');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<any>(null);
    const [showPatientDetails, setShowPatientDetails] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

    const isMobile = useIsMobile();

    

    const monthlyStats = [
      { month: 'Jan', patients: 145 },
      { month: 'Feb', patients: 162 },
      { month: 'Mar', patients: 134 },
      { month: 'Apr', patients: 187 },
      { month: 'May', patients: 156 },
      { month: 'Jun', patients: 173 },
      { month: 'Jul', patients: 198 },
      { month: 'Aug', patients: 165 }
    ];

    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);

            // Get the string from localStorage
    const userString = localStorage.getItem('user');

        // Parse it to an object
    const user = userString ? JSON.parse(userString) : null;

        // Get the patient ID
    const doctorId   = user?.pid;

    useEffect(() => {
      axios.get(`${API_BASE_URL}/doctor/appointments/${doctorId}`)
        .then(res => setAppointments(res.data))
        .catch(err => console.error(err));

      axios.get(`${API_BASE_URL}/doctor/patients/${doctorId}`)
        .then(res => setPatients(res.data))
        .catch(err => console.error(err));
    }, []);

    const getStatusIcon = (status: string) => {
      switch (status) {
        case 'confirmed':
          return <CheckCircle className="w-4 h-4 text-success" />;
        case 'cancelled':
          return <XCircle className="w-4 h-4 text-destructive" />;
        case 'pending':
          return <AlertCircle className="w-4 h-4 text-orange-500" />;
        default:
          return <Clock className="w-4 h-4 text-muted-foreground" />;
      }
    };

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'confirmed':
          return 'success';
        case 'cancelled':
          return 'destructive';
        case 'pending':
          return 'secondary';
        default:
          return 'secondary';
      }
    };

    const filteredPatients = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
      <div className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background ${isMobile ? 'pb-20' : ''}`}>
        {/* Header */}
        <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
          <div className={`relative container mx-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-8'}`}>
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Doctor Dashboard</h1>
                <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>Dr. Priya Sharma - Cardiologist</p>
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
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Appointments</span>
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
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                      activeTab === 'settings' 
                        ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                        : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${activeTab === 'settings' ? 'bg-white/20' : 'bg-primary/10'}`}>
                      <Settings className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Settings</span>
                  </button>
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

              {/* Appointments Tab */}
              <TabsContent value="appointments" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Today's Appointments</h2>
                  <p className="text-muted-foreground mb-8">Manage your scheduled appointments and patient consultations</p>
                </div>
                
                {/* Today's Appointments */}
                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 rounded-full bg-gradient-primary">
                        <Calendar className="w-6 h-6 text-primary-foreground" />
                      </div>
                      Today's Schedule
                      <Badge variant="secondary" className="ml-2">{appointments.length} appointments</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {appointments.map((appointment) => (
                      <div key={appointment.id} className="border border-border/50 rounded-xl p-5 space-y-3 bg-gradient-to-r from-background to-muted/10 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-lg">{appointment.patient}</h4>
                            <p className="text-sm text-muted-foreground">Appointment ID: {appointment.id}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Patient ID: {appointment.patientId}</p>
                          </div>
                          <Badge variant={getStatusColor(appointment.status) as any} className="flex items-center gap-1">
                            {getStatusIcon(appointment.status)}
                            {appointment.status}
                          </Badge>
                        </div>
                        <div className={`grid ${isMobile ? 'grid-cols-1 gap-2' : 'grid-cols-2 gap-4'} text-sm`}>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span>{appointment.time}</span>
                          </div>
                          {!isMobile && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-muted-foreground" />
                              <span>{appointment.contact}</span>
                            </div>
                          )}
                        </div>
                        <div className={`flex gap-2 pt-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                          <Button 
                            size="sm" 
                            className="flex-1 bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105"
                            onClick={() => {
                              const patient = patients.find(p => p.patientId === appointment.patientId);
                              setSelectedPatient(patient);
                              setSelectedAppointmentId(appointment.id);
                              setShowPatientDetails(true);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Patients Tab */}
              <TabsContent value="patients" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Patient Directory</h2>
                  <p className="text-muted-foreground mb-8">Search and manage your patient records</p>
                </div>
                
                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 rounded-full bg-gradient-secondary">
                        <Users className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      My Patients
                    </CardTitle>
                    <div className="relative mt-4">
                      <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search patients by name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`${isMobile ? 'pl-12 text-base' : 'pl-12'} border-border/50 focus:border-primary bg-background/50 backdrop-blur-sm`}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {filteredPatients.map((patient) => (
                      <div key={patient.id} className="border border-border/50 rounded-xl p-5 space-y-3 bg-gradient-to-r from-background to-muted/10 hover:shadow-lg transition-all duration-300">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <h4 className="font-semibold text-lg">{patient.name}</h4>
                            <p className="text-sm text-muted-foreground">Patient ID: {patient.patient_id}</p>
                          </div>
                          <Button size="sm" className="bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105">
                            <Stethoscope className="w-4 h-4 mr-2" />
                            View Profile
                          </Button>
                        </div>
                        <div className={`grid ${isMobile ? 'grid-cols-1 gap-3' : 'md:grid-cols-3 gap-4'} text-sm`}>
                          <div className="space-y-1">
                            <span className="text-muted-foreground font-medium">Contact:</span>
                            <div className="space-y-2">
                              <p className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{patient.phone}</span>
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className={`flex gap-2 pt-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
                          <Button size="sm" variant="outline" className="flex-1 hover:bg-muted/50">
                            <FileText className="w-4 h-4 mr-2" />
                            Medical History
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 hover:bg-muted/50">
                            <Calendar className="w-4 h-4 mr-2" />
                            Appointments
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1 hover:bg-muted/50">
                            <BarChart3 className="w-4 h-4 mr-2" />
                            Lab Reports
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Profile & Statistics</h2>
                  <p className="text-muted-foreground mb-8">View your profile information and performance metrics</p>
                </div>
                
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'lg:grid-cols-2 gap-6'}`}>
                  {/* Doctor Profile */}
                  <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-gradient-primary">
                          <Stethoscope className="w-5 h-5 text-primary-foreground" />
                        </div>
                        Doctor Profile
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10">
                          <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                          <p className="text-lg font-semibold">Dr. Priya Sharma</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10">
                          <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                          <p className="text-lg">Cardiologist</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10">
                          <label className="text-sm font-medium text-muted-foreground">License Number</label>
                          <p className="text-lg">MD-CAR-2018-001234</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10">
                          <label className="text-sm font-medium text-muted-foreground">Department</label>
                          <p className="text-lg">Cardiology Department</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10">
                          <label className="text-sm font-medium text-muted-foreground">Contact</label>
                          <div className="space-y-2 mt-2">
                            <p className="flex items-center gap-3">
                              <Phone className="w-4 h-4 text-primary" />
                              <span>+1 (555) 234-5678</span>
                            </p>
                            <p className="flex items-center gap-3">
                              <Mail className="w-4 h-4 text-primary" />
                              <span>dr.priya.sharma@hospital.com</span>
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 p-4 bg-gradient-to-r from-warning/10 to-warning/5 border border-warning/20 rounded-lg">
                        <p className="text-sm text-muted-foreground italic flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 mt-0.5 text-warning" />
                          Profile information is read-only and managed by hospital administration.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Monthly Statistics */}
                  <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                    <CardHeader className="pb-6">
                      <CardTitle className="flex items-center gap-3 text-xl">
                        <div className="p-2 rounded-lg bg-gradient-secondary">
                          <BarChart3 className="w-5 h-5 text-secondary-foreground" />
                        </div>
                        Monthly Patient Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        {monthlyStats.map((stat, index) => (
                          <div key={stat.month} className="p-3 rounded-lg bg-gradient-to-r from-muted/20 to-muted/10">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">{stat.month} 2024</span>
                              <span className="text-lg font-bold text-primary">{stat.patients}</span>
                            </div>
                            <div className="w-full bg-muted/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(stat.patients / 200) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border/50 pt-4 mt-6">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-success/10 to-success/5 border border-success/20">
                          <span className="font-semibold">Average Monthly Patients:</span>
                          <span className="text-2xl font-bold text-success">165</span>
                        </div>
                        <div className="flex items-center gap-3 mt-3 p-3 rounded-lg bg-gradient-to-r from-success/5 to-success/2">
                          <TrendingUp className="w-5 h-5 text-success" />
                          <span className="text-sm font-medium text-success">+12% from last year</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

            </Tabs>
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 shadow-lg">
            <div className="grid grid-cols-3 gap-1 p-2">
              <button
                onClick={() => setActiveTab('appointments')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'appointments' 
                    ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="text-xs font-medium">Appointments</span>
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
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                  activeTab === 'settings' 
                    ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                    : 'hover:bg-muted/50'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="text-xs font-medium">Settings</span>
              </button>
            </div>
          </div>
        )}

        {/* Patient Details Modal */}
        <PatientDetails 
          patient={selectedPatient}
          appointmentId={selectedAppointmentId} 
          open={showPatientDetails}
          onOpenChange={setShowPatientDetails}
        />
      </div>
    );
  };

  export default DoctorDashboard;