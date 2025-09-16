import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Calendar, FileText, CreditCard, Clock, MapPin, User, Phone, Mail, Download, RefreshCw, CheckCircle, XCircle, AlertCircle, UserCircle, Bell, LogOut, FlaskConical, Activity } from 'lucide-react';
import EditProfileModal from './EditProfileModal';
const PatientDashboard = () => {
  const [activeTab, setActiveTab] = useState('echannel');
  const [activeEChannelTab, setActiveEChannelTab] = useState('book');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const appointments = [{
    id: 1,
    doctor: 'Dr. Priya Sharma',
    specialization: 'Cardiologist',
    date: '2024-09-15',
    time: '10:30 AM',
    status: 'confirmed',
    branch: 'Main Hospital',
    payment: 'Paid - $150'
  }, {
    id: 2,
    doctor: 'Dr. Marcus Johnson',
    specialization: 'Orthopedic Surgeon',
    date: '2024-09-10',
    time: '2:00 PM',
    status: 'completed',
    branch: 'Orthopedic Center',
    payment: 'Paid - $200'
  }, {
    id: 3,
    doctor: 'Dr. Carlos Rodriguez',
    specialization: 'Neurologist',
    date: '2024-09-05',
    time: '9:00 AM',
    status: 'cancelled',
    branch: 'Neurology Wing',
    payment: 'Refunded - $175'
  }];
  const labReports = [{
    id: 1,
    testName: 'Complete Blood Count',
    date: '2024-09-08',
    status: 'Ready',
    doctor: 'Dr. Priya Sharma'
  }, {
    id: 2,
    testName: 'Lipid Profile',
    date: '2024-09-08',
    status: 'Ready',
    doctor: 'Dr. Priya Sharma'
  }, {
    id: 3,
    testName: 'Thyroid Function Test',
    date: '2024-08-25',
    status: 'Ready',
    doctor: 'Dr. Emily Wilson'
  }];
  const payments = [{
    id: 1,
    description: 'Consultation - Dr. Priya Sharma',
    amount: '$150',
    date: '2024-09-15',
    status: 'Paid',
    method: 'Credit Card'
  }, {
    id: 2,
    description: 'Lab Tests - Complete Blood Work',
    amount: '$85',
    date: '2024-09-08',
    status: 'Paid',
    method: 'Insurance'
  }, {
    id: 3,
    description: 'Consultation - Dr. Marcus Johnson',
    amount: '$200',
    date: '2024-09-10',
    status: 'Paid',
    method: 'Cash'
  }];
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'Paid':
      case 'Ready':
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
      case 'Paid':
      case 'Ready':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'pending':
        return 'secondary';
      default:
        return 'secondary';
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-hero">
        <div className="container mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Patient Dashboard</h1>
              <p className="opacity-90">Welcome back, John Doe</p>
            </div>
            <div className="flex gap-3 items-center">
              <Button variant="outline" onClick={() => window.location.href = '/'} className="border-primary-foreground bg-slate-50 text-slate-950">
                Home
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="border-primary-foreground bg-slate-50 text-slate-950 p-2">
                    <UserCircle className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => setIsEditProfileOpen(true)}>
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/'}>
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
        {/* Sidebar */}
        <aside className="w-64 bg-card border-r shadow-sm">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('echannel')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeTab === 'echannel' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Calendar className="w-5 h-5" />
              <span className="font-medium">E-Channel</span>
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeTab === 'activities' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <Activity className="w-5 h-5" />
              <span className="font-medium">Activities</span>
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeTab === 'payments' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="font-medium">Payments</span>
            </button>
            <button
              onClick={() => setActiveTab('labreports')}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                activeTab === 'labreports' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
            >
              <FlaskConical className="w-5 h-5" />
              <span className="font-medium">Lab Reports</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">

          {/* E-Channel Tab */}
          <TabsContent value="echannel" className="space-y-6">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">E-Channel Services</h2>
                <Select value={activeEChannelTab} onValueChange={setActiveEChannelTab}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Book Appointment</SelectItem>
                    <SelectItem value="reschedule">Reschedule Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeEChannelTab === 'book' && <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Book New Appointment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="hover:shadow-lg transition-all">
                        <CardContent className="p-4 text-center">
                          <MapPin className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">Select Branch</h3>
                          <p className="text-sm text-muted-foreground">Choose hospital location</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all">
                        <CardContent className="p-4 text-center">
                          <FileText className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">Specialization</h3>
                          <p className="text-sm text-muted-foreground">Select medical specialty</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all">
                        <CardContent className="p-4 text-center">
                          <User className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">Choose Doctor</h3>
                          <p className="text-sm text-muted-foreground">Select preferred doctor</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-lg transition-all">
                        <CardContent className="p-4 text-center">
                          <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                          <h3 className="font-semibold">Pick Date</h3>
                          <p className="text-sm text-muted-foreground">Available time slots</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Button className="mt-6 w-full bg-gradient-primary hover:opacity-90" onClick={() => window.location.href = '/appointment-booking'}>
                      Start Booking Process
                    </Button>
                  </CardContent>
                </Card>}

              {activeEChannelTab === 'reschedule' && <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-primary" />
                      Reschedule Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No Reschedule Requests</h3>
                      <p className="text-muted-foreground">You don't have any pending reschedule requests at the moment.</p>
                    </div>
                  </CardContent>
                </Card>}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Appointments */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Recent Appointments
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {appointments.map(appointment => <div key={appointment.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{appointment.doctor}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                        </div>
                        <Badge variant={getStatusColor(appointment.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{appointment.date} at {appointment.time}</span>
                        <span>{appointment.branch}</span>
                      </div>
                      <div className="text-sm font-medium text-primary">
                        {appointment.payment}
                      </div>
                      {appointment.status === 'confirmed' && <Button size="sm" variant="outline" className="w-full">
                          <RefreshCw className="w-3 h-3 mr-2" />
                          Request Reschedule
                        </Button>}
                    </div>)}
                </CardContent>
              </Card>

              {/* Lab Reports */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Lab Reports
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {labReports.map(report => <div key={report.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{report.testName}</h4>
                          <p className="text-sm text-muted-foreground">Ordered by {report.doctor}</p>
                        </div>
                        <Badge variant={getStatusColor(report.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          {report.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Test Date: {report.date}
                      </div>
                      <Button size="sm" variant="outline" className="w-full">
                        <Download className="w-3 h-3 mr-2" />
                        Download Report
                      </Button>
                    </div>)}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payments.map(payment => <div key={payment.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{payment.description}</h4>
                        <p className="text-sm text-muted-foreground">Payment Method: {payment.method}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-lg">{payment.amount}</div>
                        <Badge variant={getStatusColor(payment.status) as any} className="flex items-center gap-1 mt-1">
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Transaction Date: {payment.date}
                    </div>
                  </div>)}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lab Reports Tab */}
          <TabsContent value="labreports" className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-primary" />
                  Lab Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {labReports.map(report => 
                  <div key={report.id} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{report.testName}</h4>
                        <p className="text-sm text-muted-foreground">Ordered by {report.doctor}</p>
                      </div>
                      <Badge variant={getStatusColor(report.status) as any} className="flex items-center gap-1">
                        {getStatusIcon(report.status)}
                        {report.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Test Date: {report.date}
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      <Download className="w-3 h-3 mr-2" />
                      Download Report
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen} />
    </div>;
};
export default PatientDashboard;