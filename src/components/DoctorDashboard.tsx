import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import PatientDetails from './PatientDetails';
import PatientMessaging from './PatientMessaging';
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
  TrendingUp
} from 'lucide-react';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showPatientMessaging, setShowPatientMessaging] = useState(false);

  const upcomingAppointments = [
    {
      id: 1,
      patient: 'John Doe',
      patientId: 'PT123456789',
      time: '9:00 AM',
      date: '2024-09-15',
      type: 'Follow-up',
      status: 'confirmed',
      contact: '+1 (555) 123-4567'
    },
    {
      id: 2,
      patient: 'Jane Smith',
      patientId: 'PT987654321',
      time: '10:30 AM',
      date: '2024-09-15',
      type: 'Initial Consultation',
      status: 'confirmed',
      contact: '+1 (555) 987-6543'
    },
    {
      id: 3,
      patient: 'Mike Johnson',
      patientId: 'PT456789123',
      time: '2:00 PM',
      date: '2024-09-15',
      type: 'Procedure Follow-up',
      status: 'pending',
      contact: '+1 (555) 456-7890'
    }
  ];


  const patients = [
    {
      id: 1,
      name: 'John Doe',
      patientId: 'PT123456789',
      lastVisit: '2024-08-15',
      condition: 'Hypertension',
      phone: '+1 (555) 123-4567',
      email: 'john.doe@email.com'
    },
    {
      id: 2,
      name: 'Jane Smith',
      patientId: 'PT987654321',
      lastVisit: '2024-07-22',
      condition: 'Diabetes Type 2',
      phone: '+1 (555) 987-6543',
      email: 'jane.smith@email.com'
    },
    {
      id: 3,
      name: 'Mike Johnson',
      patientId: 'PT456789123',
      lastVisit: '2024-09-01',
      condition: 'Post-surgery recovery',
      phone: '+1 (555) 456-7890',
      email: 'mike.johnson@email.com'
    },
    {
      id: 4,
      name: 'Sarah Wilson',
      patientId: 'PT321654987',
      lastVisit: '2024-08-28',
      condition: 'Routine Checkup',
      phone: '+1 (555) 321-6549',
      email: 'sarah.wilson@email.com'
    }
  ];

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-hero">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Doctor Dashboard</h1>
              <p className="opacity-90">Dr. Priya Sharma - Cardiologist</p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="border-primary-foreground text-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => window.location.href = '/'}
              >
                Home
              </Button>
              <Button 
                variant="outline" 
                className="border-primary-foreground text-foreground hover:bg-primary-foreground hover:text-primary"
                onClick={() => {
                  // Handle logout logic here
                  window.location.href = '/';
                }}
              >
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Appointments
            </TabsTrigger>
            <TabsTrigger value="patients" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Appointments Tab */}
          <TabsContent value="appointments" className="space-y-6">
            {/* Today's Appointments */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Today's Appointments
                  <Badge variant="secondary">{upcomingAppointments.length}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{appointment.patient}</h4>
                        <p className="text-sm text-muted-foreground">ID: {appointment.patientId}</p>
                      </div>
                      <Badge variant={getStatusColor(appointment.status) as any} className="flex items-center gap-1">
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {appointment.time}
                      </span>
                      <span className="text-primary font-medium">{appointment.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {appointment.contact}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-gradient-primary hover:opacity-90"
                        onClick={() => {
                          const patient = patients.find(p => p.patientId === appointment.patientId);
                          setSelectedPatient(patient);
                          setShowPatientDetails(true);
                        }}
                      >
                        View Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => {
                          const patient = patients.find(p => p.patientId === appointment.patientId);
                          setSelectedPatient(patient);
                          setShowPatientMessaging(true);
                        }}
                      >
                        Contact Patient
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Patient Directory
                </CardTitle>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search patients by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredPatients.map((patient) => (
                  <div key={patient.id} className="border rounded-lg p-4 space-y-2 hover:shadow-lg transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-lg">{patient.name}</h4>
                        <p className="text-sm text-muted-foreground">Patient ID: {patient.patientId}</p>
                      </div>
                      <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                        View Profile
                      </Button>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Last Visit:</span>
                        <p className="font-medium">{patient.lastVisit}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Condition:</span>
                        <p className="font-medium">{patient.condition}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Contact:</span>
                        <div className="space-y-1">
                          <p className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </p>
                          <p className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-3 h-3 mr-1" />
                        Medical History
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        Appointments
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <FileText className="w-3 h-3 mr-1" />
                        Lab Reports
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Doctor Profile */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Doctor Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-lg font-semibold">Dr. Priya Sharma</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Specialization</label>
                      <p className="text-lg">Cardiologist</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">License Number</label>
                      <p className="text-lg">MD-CAR-2018-001234</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Department</label>
                      <p className="text-lg">Cardiology Department</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Years of Experience</label>
                      <p className="text-lg">12 years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact</label>
                      <div className="space-y-1">
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          +1 (555) 234-5678
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          dr.priya.sharma@hospital.com
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground italic">
                    Note: Profile information is read-only and managed by hospital administration.
                  </p>
                </CardContent>
              </Card>

              {/* Monthly Statistics */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Monthly Patient Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {monthlyStats.map((stat, index) => (
                      <div key={stat.month} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{stat.month} 2024</span>
                        <div className="flex items-center gap-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full"
                            style={{ width: `${(stat.patients / 200) * 100}px` }}
                          ></div>
                          <span className="text-sm font-semibold min-w-[3rem]">{stat.patients}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Average Monthly Patients:</span>
                      <span className="text-lg font-bold text-primary">165</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-success">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+12% from last year</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Patient Details Modal */}
      <PatientDetails 
        patient={selectedPatient}
        open={showPatientDetails}
        onOpenChange={setShowPatientDetails}
      />

      {/* Patient Messaging Modal */}
      <PatientMessaging 
        patient={selectedPatient}
        open={showPatientMessaging}
        onOpenChange={setShowPatientMessaging}
        hideAppointments={true}
      />
    </div>
  );
};

export default DoctorDashboard;