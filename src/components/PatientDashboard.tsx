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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className="relative container mx-auto px-8 py-8">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">Patient Dashboard</h1>
              <p className="text-primary-foreground/90 text-lg">Welcome back, John Doe</p>
            </div>
            <div className="flex gap-4 items-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className="border-primary-foreground/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 shadow-button"
              >
                <User className="w-4 h-4 mr-2" />
                Home
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="border-primary-foreground/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 shadow-button px-4"
                  >
                    Profile
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm border-border/50">
                  <DropdownMenuItem onClick={() => setIsEditProfileOpen(true)} className="hover:bg-primary/10">
                    <User className="w-4 h-4 mr-2" />
                    Edit Profile
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
        {/* Sidebar */}
        <aside className="w-72 bg-gradient-to-b from-card via-card/95 to-muted/20 border-r border-border/50 shadow-lg backdrop-blur-sm">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">Navigation</h3>
              <div className="h-1 w-12 bg-gradient-primary rounded-full"></div>
            </div>
            <nav className="space-y-3">
              <button
                onClick={() => setActiveTab('echannel')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'echannel' 
                    ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                    : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === 'echannel' ? 'bg-white/20' : 'bg-primary/10'}`}>
                  <Calendar className="w-5 h-5" />
                </div>
                <span className="font-medium">E-Channel</span>
              </button>
              <button
                onClick={() => setActiveTab('activities')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'activities' 
                    ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                    : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === 'activities' ? 'bg-white/20' : 'bg-primary/10'}`}>
                  <Activity className="w-5 h-5" />
                </div>
                <span className="font-medium">Activities</span>
              </button>
              <button
                onClick={() => setActiveTab('payments')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'payments' 
                    ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                    : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === 'payments' ? 'bg-white/20' : 'bg-primary/10'}`}>
                  <CreditCard className="w-5 h-5" />
                </div>
                <span className="font-medium">Payments</span>
              </button>
              <button
                onClick={() => setActiveTab('labreports')}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                  activeTab === 'labreports' 
                    ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                    : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-lg ${activeTab === 'labreports' ? 'bg-white/20' : 'bg-primary/10'}`}>
                  <FlaskConical className="w-5 h-5" />
                </div>
                <span className="font-medium">Lab Reports</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gradient-to-br from-background to-muted/20">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

          {/* E-Channel Tab */}
          <TabsContent value="echannel" className="space-y-8">
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">E-Channel Services</h2>
                  <p className="text-muted-foreground mt-1">Book appointments and manage your healthcare needs</p>
                </div>
                <Select value={activeEChannelTab} onValueChange={setActiveEChannelTab}>
                  <SelectTrigger className="w-56 bg-card/50 backdrop-blur-sm border-border/50 shadow-sm">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent className="bg-card/95 backdrop-blur-sm border-border/50">
                    <SelectItem value="book">Book Appointment</SelectItem>
                    <SelectItem value="reschedule">Reschedule Request</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {activeEChannelTab === 'book' && (
                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 rounded-full bg-gradient-primary">
                        <Calendar className="w-6 h-6 text-primary-foreground" />
                      </div>
                      Book New Appointment
                    </CardTitle>
                    <p className="text-muted-foreground ml-12">Follow these simple steps to book your appointment</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-gradient-primary mx-auto mb-4 w-fit">
                            <MapPin className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Select Branch</h3>
                          <p className="text-sm text-muted-foreground">Choose hospital location</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-gradient-secondary mx-auto mb-4 w-fit">
                            <FileText className="w-8 h-8 text-secondary-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Specialization</h3>
                          <p className="text-sm text-muted-foreground">Select medical specialty</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-success/5 to-accent/5 border-success/20">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-success mx-auto mb-4 w-fit">
                            <User className="w-8 h-8 text-success-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Choose Doctor</h3>
                          <p className="text-sm text-muted-foreground">Select preferred doctor</p>
                        </CardContent>
                      </Card>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-warning/5 to-accent/5 border-warning/20">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-warning mx-auto mb-4 w-fit">
                            <Calendar className="w-8 h-8 text-warning-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Pick Date</h3>
                          <p className="text-sm text-muted-foreground">Available time slots</p>
                        </CardContent>
                      </Card>
                    </div>
                    <Button className="w-full h-14 text-lg bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105" onClick={() => window.location.href = '/appointment-booking'}>
                      Start Booking Process
                      <Calendar className="w-5 h-5 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )}

              {activeEChannelTab === 'reschedule' && (
                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-2xl">
                      <div className="p-3 rounded-full bg-gradient-secondary">
                        <RefreshCw className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      Reschedule Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <div className="p-6 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 mx-auto mb-6 w-fit">
                        <AlertCircle className="w-16 h-16 text-muted-foreground" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">No Reschedule Requests</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">You don't have any pending reschedule requests at the moment. When you need to reschedule an appointment, it will appear here.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Recent Activities</h2>
              <p className="text-muted-foreground mb-8">View your recent appointments</p>
            </div>
            <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary">
                    <Calendar className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Recent Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appointments.map(appointment => (
                  <div key={appointment.id} className="border border-border/50 rounded-xl p-5 space-y-3 bg-gradient-to-r from-background to-muted/10 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">{appointment.doctor}</h4>
                        <p className="text-sm text-muted-foreground">{appointment.specialization}</p>
                      </div>
                      <Badge variant={getStatusColor(appointment.status) as any} className="flex items-center gap-1 px-3 py-1">
                        {getStatusIcon(appointment.status)}
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {appointment.date} at {appointment.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {appointment.branch}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-primary bg-primary/10 p-3 rounded-lg">
                      <CreditCard className="w-4 h-4 inline mr-2" />
                      {appointment.payment}
                    </div>
                    {appointment.status === 'confirmed' && (
                      <Button size="sm" variant="outline" className="w-full mt-3 border-primary/30 hover:bg-primary/10">
                        <RefreshCw className="w-3 h-3 mr-2" />
                        Request Reschedule
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Payment History</h2>
              <p className="text-muted-foreground mb-8">Track all your medical payments and transactions</p>
            </div>
            <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-primary">
                    <CreditCard className="w-5 h-5 text-primary-foreground" />
                  </div>
                  Transaction History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {payments.map(payment => (
                  <div key={payment.id} className="border border-border/50 rounded-xl p-6 space-y-4 bg-gradient-to-r from-background to-muted/10 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg">{payment.description}</h4>
                        <p className="text-sm text-muted-foreground bg-muted/20 px-3 py-1 rounded-full inline-block">
                          Payment Method: {payment.method}
                        </p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="font-bold text-2xl text-primary">{payment.amount}</div>
                        <Badge variant={getStatusColor(payment.status) as any} className="flex items-center gap-1 px-3 py-1">
                          {getStatusIcon(payment.status)}
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Transaction Date: {payment.date}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lab Reports Tab */}
          <TabsContent value="labreports" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Lab Reports</h2>
              <p className="text-muted-foreground mb-8">Access and download your medical test results</p>
            </div>
            <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-gradient-secondary">
                    <FlaskConical className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  Available Reports
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {labReports.map(report => (
                  <div key={report.id} className="border border-border/50 rounded-xl p-6 space-y-4 bg-gradient-to-r from-background to-muted/10 hover:shadow-lg transition-all duration-300">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-semibold text-lg">{report.testName}</h4>
                        <p className="text-sm text-muted-foreground">Ordered by {report.doctor}</p>
                      </div>
                      <Badge variant={getStatusColor(report.status) as any} className="flex items-center gap-1 px-3 py-1">
                        {getStatusIcon(report.status)}
                        {report.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                      <Calendar className="w-4 h-4 inline mr-2" />
                      Test Date: {report.date}
                    </div>
                    <div className="flex gap-3">
                      <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 border-primary/30 hover:bg-primary/10">
                        <FileText className="w-4 h-4 mr-2" />
                        View Online
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          </Tabs>
        </main>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen} />
    </div>
  );
};

export default PatientDashboard;