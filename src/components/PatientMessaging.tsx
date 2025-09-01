import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Calendar, Phone, Mail, CheckCircle, Clock } from 'lucide-react';

interface PatientMessagingProps {
  patient: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hideAppointments?: boolean;
}

const PatientMessaging = ({ patient, open, onOpenChange, hideAppointments = false }: PatientMessagingProps) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'doctor',
      message: 'Hello John, this is Dr. Sharma. How are you feeling after your last visit?',
      timestamp: '2024-09-14 10:30 AM',
      read: true
    },
    {
      id: 2,
      sender: 'patient',
      message: 'Hi Dr. Sharma, I\'m feeling much better. The medication is working well.',
      timestamp: '2024-09-14 11:15 AM',
      read: true
    },
    {
      id: 3,
      sender: 'doctor',
      message: 'That\'s great to hear! Please continue with the current medication and we\'ll review in your next appointment.',
      timestamp: '2024-09-14 11:20 AM',
      read: true
    }
  ]);

  const pastAppointments = [
    {
      id: 1,
      date: '2024-08-15',
      time: '2:30 PM',
      type: 'Follow-up Consultation',
      status: 'completed',
      notes: 'Patient responded well to treatment. Continue current medication.',
      prescription: 'Lisinopril 10mg daily'
    },
    {
      id: 2,
      date: '2024-07-20',
      time: '9:00 AM',
      type: 'Initial Consultation',
      status: 'completed',
      notes: 'New patient with hypertension. Started on ACE inhibitor.',
      prescription: 'Lisinopril 5mg daily, lifestyle modifications'
    },
    {
      id: 3,
      date: '2024-06-10',
      time: '11:00 AM',
      type: 'Diagnostic',
      status: 'completed',
      notes: 'ECG and stress test completed. Results normal.',
      prescription: 'No medication changes'
    }
  ];

  if (!patient) return null;

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: messages.length + 1,
        sender: 'doctor',
        message: newMessage,
        timestamp: new Date().toLocaleString(),
        read: false
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const handleQuickMessage = (template: string) => {
    setNewMessage(template);
  };

  const quickMessages = [
    'Please take your medication as prescribed.',
    'How are you feeling today?',
    'Please schedule a follow-up appointment.',
    'Your test results look good.',
    'Please call the office if you have any concerns.'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            Communication - {patient.name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="messaging" className="space-y-4">
          {!hideAppointments && (
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="messaging">Messaging</TabsTrigger>
              <TabsTrigger value="appointments">Past Appointments</TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="messaging">
            <div className="grid gap-6">
              {/* Patient Contact Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <a href={`tel:${patient.phone}`} className="text-primary hover:underline">
                        {patient.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <a href={`mailto:${patient.email}`} className="text-primary hover:underline">
                        {patient.email}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Message History */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Message History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-60 overflow-y-auto">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'doctor'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Message Templates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-2">
                    {quickMessages.map((template, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickMessage(template)}
                        className="text-left h-auto p-2 justify-start"
                      >
                        {template}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* New Message */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Send New Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Type your message here..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      rows={4}
                    />
                    <div className="flex justify-between">
                      <p className="text-sm text-muted-foreground">
                        Messages are sent securely through the patient portal
                      </p>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-primary hover:opacity-90"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Send Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {!hideAppointments && (
            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Past Appointments with {patient.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pastAppointments.map((appointment) => (
                      <div key={appointment.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{appointment.type}</h4>
                            <p className="text-sm text-muted-foreground">
                              {appointment.date} at {appointment.time}
                            </p>
                          </div>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            {appointment.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Notes:</label>
                            <p className="text-sm">{appointment.notes}</p>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-muted-foreground">Prescription:</label>
                            <p className="text-sm font-medium">{appointment.prescription}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default PatientMessaging;