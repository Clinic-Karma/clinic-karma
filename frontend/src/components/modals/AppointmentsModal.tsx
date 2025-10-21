// components/modals/AppointmentsModal.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, Clock, Phone, MapPin, CheckCircle, XCircle, AlertCircle, Video, FileText, Edit, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Appointment {
  id: number;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  location?: string;
  notes?: string;
  doctor: string;
  duration: number;
}

interface AppointmentsModalProps {
  patient: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AppointmentsModal = ({ patient, open, onOpenChange }: AppointmentsModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const appointments: Appointment[] = [
    {
      id: 1,
      date: '2025-10-25',
      time: '10:30 AM',
      type: 'in-person',
      status: 'confirmed',
      reason: 'Follow-up consultation',
      location: 'Main Hospital, Room 305',
      notes: 'Discuss recent lab results and medication adjustments.',
      doctor: 'Dr. John Smith',
      duration: 30
    },
    {
      id: 2,
      date: '2025-11-05',
      time: '02:15 PM',
      type: 'video',
      status: 'scheduled',
      reason: 'Routine checkup',
      location: '',
      notes: '',
      doctor: 'Dr. Sarah Johnson',
      duration: 45
    },
    {
      id: 3,
      date: '2025-10-20',
      time: '11:00 AM',
      type: 'in-person',
      status: 'cancelled',
      reason: 'Annual physical',
      location: 'Main Hospital, Room 305',
      notes: 'Patient cancelled due to scheduling conflict.',
      doctor: 'Dr. John Smith',
      duration: 60
    },
    {
      id: 4,
      date: '2025-12-15',
      time: '09:45 AM',
      type: 'phone',
      status: 'scheduled',
      reason: 'Medication review',
      location: '',
      notes: '',
      doctor: 'Dr. Michael Brown',
      duration: 20
    }
  ];

  const filteredAppointments = appointments.filter(appointment =>
    appointment.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.date.includes(searchTerm) ||
    appointment.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.status.includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'completed': return 'success';
      case 'scheduled': return 'secondary';
      case 'cancelled': return 'destructive';
      case 'no-show': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'cancelled':
      case 'no-show':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'scheduled':
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      default:
        return <Calendar className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTypeIcon = (type: Appointment['type']) => {
    switch (type) {
      case 'in-person': return <MapPin className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <Phone className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            Appointments - {patient?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-1 bg-muted/20 rounded-lg">
            <div className="relative flex-1">
              <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-0">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Appointments List */}
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <Card
                  key={appointment.id}
                  className={`hover:shadow-md transition-all duration-300 cursor-pointer ${
                    selectedAppointment?.id === appointment.id ? 'ring-2 ring-primary/20 bg-primary/5' : 'border-border/50'
                  }`}
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1 flex-1">
                        <h4 className="font-semibold text-lg">{appointment.reason}</h4>
                        <div className="flex flex-wrap gap-2 items-center text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(appointment.type)}
                            <span>{appointment.type.replace('-', ' ').toUpperCase()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{appointment.time} ({appointment.duration}min)</span>
                          </div>
                          <Badge variant={getStatusColor(appointment.status) as any} className="flex items-center gap-1 text-xs">
                            {getStatusIcon(appointment.status)}
                            {appointment.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-sm font-medium">{appointment.date}</span>
                        <span className="text-xs text-muted-foreground">Dr. {appointment.doctor}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {appointment.location && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">{appointment.location}</span>
                      </div>
                    )}
                    {appointment.notes && (
                      <div className="p-3 bg-muted/20 rounded-lg">
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{appointment.notes}</p>
                      </div>
                    )}
                    <div className="flex justify-end pt-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle reschedule or other actions
                        }}
                      >
                        <Edit className="w-3 h-3" />
                        {appointment.status === 'cancelled' ? 'Reschedule' : 'Reschedule/Cancel'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredAppointments.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Calendar className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No appointments found</h3>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedAppointment(null);
              onOpenChange(false);
            }}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => {
                // Handle new appointment
                console.log('Schedule new appointment');
              }}
            >
              <Calendar className="w-4 h-4" />
              Schedule New
            </Button>
            <Button className="bg-gradient-primary flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {selectedAppointment ? 'View Details' : 'Export History'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentsModal;