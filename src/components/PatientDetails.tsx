import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, MapPin, Calendar, FileText, Activity, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PatientDetailsProps {
  patient: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientDetails = ({ patient, open, onOpenChange }: PatientDetailsProps) => {
  if (!patient) return null;

  const medicalHistory = [
    {
      id: 1,
      date: '2024-08-15',
      diagnosis: 'Hypertension',
      treatment: 'Prescribed ACE inhibitors',
      doctor: 'Dr. Priya Sharma',
      status: 'ongoing'
    },
    {
      id: 2,
      date: '2024-07-20',
      diagnosis: 'Annual Physical',
      treatment: 'Routine checkup completed',
      doctor: 'Dr. Priya Sharma',
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-06-10',
      diagnosis: 'Minor chest pain investigation',
      treatment: 'ECG and stress test - normal results',
      doctor: 'Dr. Priya Sharma',
      status: 'resolved'
    }
  ];

  const appointments = [
    {
      id: 1,
      date: '2024-09-20',
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'scheduled'
    },
    {
      id: 2,
      date: '2024-08-15',
      time: '2:30 PM',
      type: 'Consultation',
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-07-20',
      time: '9:00 AM',
      type: 'Annual Physical',
      status: 'completed'
    }
  ];

  const labReports = [
    {
      id: 1,
      testName: 'Complete Blood Count',
      date: '2024-08-10',
      status: 'Normal',
      results: 'All values within normal range'
    },
    {
      id: 2,
      testName: 'Lipid Profile',
      date: '2024-08-10',
      status: 'Attention Needed',
      results: 'Slightly elevated cholesterol'
    },
    {
      id: 3,
      testName: 'ECG',
      date: '2024-06-10',
      status: 'Normal',
      results: 'No abnormalities detected'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'resolved':
      case 'scheduled':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'ongoing':
      case 'Attention Needed':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
      case 'resolved':
      case 'scheduled':
      case 'Normal':
        return 'success';
      case 'cancelled':
        return 'destructive';
      case 'ongoing':
      case 'Attention Needed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Patient Details - {patient.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">Medical History</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="reports">Lab Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-lg font-semibold">{patient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Patient ID</label>
                      <p className="font-mono">{patient.patientId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Contact Information</label>
                      <div className="space-y-1">
                        <p className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4" />
                          {patient.phone}
                        </p>
                        <p className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4" />
                          {patient.email}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Address</label>
                      <p className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4" />
                        123 Main Street, Anytown, ST 12345
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Medical Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Condition</label>
                    <p className="font-semibold">{patient.condition}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Visit</label>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {patient.lastVisit}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Risk Factors</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary">Family History</Badge>
                      <Badge variant="secondary">High Blood Pressure</Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Current Medications</label>
                    <ul className="text-sm space-y-1 mt-1">
                      <li>• Lisinopril 10mg - Daily</li>
                      <li>• Aspirin 81mg - Daily</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Medical History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medicalHistory.map((record) => (
                    <div key={record.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{record.diagnosis}</h4>
                          <p className="text-sm text-muted-foreground">By {record.doctor}</p>
                        </div>
                        <Badge variant={getStatusColor(record.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(record.status)}
                          {record.status}
                        </Badge>
                      </div>
                      <p className="text-sm">{record.treatment}</p>
                      <p className="text-xs text-muted-foreground">Date: {record.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Appointment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(appointment.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(appointment.status)}
                          {appointment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Laboratory Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {labReports.map((report) => (
                    <div key={report.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{report.testName}</h4>
                          <p className="text-sm text-muted-foreground">Date: {report.date}</p>
                        </div>
                        <Badge variant={getStatusColor(report.status) as any} className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          {report.status}
                        </Badge>
                      </div>
                      <p className="text-sm">{report.results}</p>
                      <Button size="sm" variant="outline" className="mt-2">
                        <Download className="w-3 h-3 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDetails;