import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, User, Clock, ArrowLeft, CheckCircle } from 'lucide-react';

const AppointmentBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    branch: '',
    specialization: '',
    doctor: '',
    date: '',
    time: '',
    reason: '',
    urgency: 'routine'
  });

  const branches = [
    'Colombo branch',
    'Kandy branch',
    'Galle branch'
  ];

  const specializations = [
    'Cardiology',
    'Orthopedic Surgery',
    'Neurology',
    'Pediatrics',
    'Dermatology',
    'Gynecology'
  ];

  const doctors = {
    'Cardiology': ['Dr. Priya Sharma', 'Dr. John Smith'],
    'Orthopedic Surgery': ['Dr. Marcus Johnson', 'Dr. Sarah Lee'],
    'Neurology': ['Dr. Carlos Rodriguez', 'Dr. Emily Chen'],
    'Pediatrics': ['Dr. Sarah Chen', 'Dr. Michael Brown'],
    'Dermatology': ['Dr. Robert Kim', 'Dr. Lisa Wang'],
    'Gynecology': ['Dr. Maria Lopez', 'Dr. Jennifer Davis']
  };

  const availableTimes = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    // Handle booking confirmation
    setCurrentStep(5);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Select Branch & Specialization</h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Hospital Branch</label>
                <Select value={bookingData.branch} onValueChange={(value) => setBookingData({...bookingData, branch: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Medical Specialization</label>
                <Select value={bookingData.specialization} onValueChange={(value) => setBookingData({...bookingData, specialization: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {specializations.map((spec) => (
                      <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Choose Doctor</h3>
            <div className="grid gap-4">
              {bookingData.specialization && doctors[bookingData.specialization as keyof typeof doctors]?.map((doctor) => (
                <Card 
                  key={doctor} 
                  className={`cursor-pointer transition-all ${bookingData.doctor === doctor ? 'ring-2 ring-primary' : 'hover:shadow-lg'}`}
                  onClick={() => setBookingData({...bookingData, doctor})}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{doctor}</h4>
                        <p className="text-sm text-muted-foreground">{bookingData.specialization}</p>
                        <Badge variant="secondary" className="mt-1">Available</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Select Date & Time</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Preferred Date</label>
                <Input 
                  type="date" 
                  value={bookingData.date}
                  onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Available Times</label>
                <div className="grid grid-cols-3 gap-2">
                  {availableTimes.map((time) => (
                    <Button
                      key={time}
                      variant={bookingData.time === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookingData({...bookingData, time})}
                      className="text-xs"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );


      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-success-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-success">Appointment Confirmed!</h3>
            <div className="bg-muted/50 rounded-lg p-6 text-left space-y-3">
              <h4 className="font-semibold">Appointment Details:</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Doctor:</span>
                  <span className="font-medium">{bookingData.doctor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-medium">{bookingData.date} at {bookingData.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Branch:</span>
                  <span className="font-medium">{bookingData.branch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Appointment ID:</span>
                  <span className="font-medium">APT-{Date.now()}</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              A confirmation email has been sent to your registered email address. Please arrive 15 minutes early for your appointment.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-hero">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.location.href = '/patient-dashboard'}
              className="border-primary-foreground text-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Book Appointment</h1>
              <p className="opacity-90">Schedule your medical consultation</p>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      {currentStep < 4 && (
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                {step < 3 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-6 pb-8">
        <Card className="max-w-2xl mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {currentStep < 4 ? `Step ${currentStep} of 3` : 'Booking Complete'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {renderStepContent()}

            {/* Navigation Buttons */}
            {currentStep < 4 && (
              <div className="flex justify-between pt-6">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <Button 
                  onClick={currentStep === 3 ? handleConfirmBooking : handleNext}
                  className="bg-gradient-primary hover:opacity-90"
                  disabled={
                    (currentStep === 1 && (!bookingData.branch || !bookingData.specialization)) ||
                    (currentStep === 2 && !bookingData.doctor) ||
                    (currentStep === 3 && (!bookingData.date || !bookingData.time))
                  }
                >
                  {currentStep === 3 ? 'Confirm Booking' : 'Next'}
                </Button>
              </div>
            )}

            {/* Final Step Actions */}
            {currentStep === 4 && (
              <div className="flex gap-4 pt-6">
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/patient-dashboard'}
                  className="flex-1"
                >
                  Back to Dashboard
                </Button>
                <Button 
                  onClick={() => window.print()}
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                >
                  Print Confirmation
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AppointmentBooking;