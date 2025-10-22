import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, MapPin, User, Clock, ArrowLeft, CheckCircle, Printer } from 'lucide-react';

import axios from 'axios';
import "../utils/printA4.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite


const AppointmentBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [specializations, setSpecializations] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableTimes, setAvailableTimes] = useState<string[]>([
    '9:00 AM', '10:00 AM',
    '11:00 AM', '1:00 PM', '2:00 PM',
    '3:00 PM', '4:00 PM'
  ]);

  const [appointmentID, setAppointmentID] = useState(1);

    // Master time list in 24-hour format
  const allTimeSlots = [
    '09:00:00', '10:00:00', '11:00:00',
    '13:00:00', '14:00:00', '15:00:00', '16:00:00'
  ];

    // Utility to format times to AM/PM
  const formatTime = (time: string) => {
    const [hour] = time.split(':');
    const h = parseInt(hour);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const formatted = ((h + 11) % 12 + 1) + ':00 ' + suffix;
    return formatted;
  };

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
    'Colombo',
    'Kandy',
    'Galle'
  ];

  //  Fetch specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/patient/specializations`);
        setSpecializations(res.data);
      } catch (error) {
        console.error("Error fetching specializations:", error);
        setSpecializations([]);
      }
    };

    fetchSpecializations();
  }, []);

// Fetch doctors when branch & specialization are selected
useEffect(() => {
  const fetchDoctors = async () => {
    try {
      const branch = bookingData.branch;
      const specialization_id = specializations.find(
        spec => spec.Specialization_Name === bookingData.specialization
      )?.Specialization_ID;

      if (!branch || !specialization_id) return;

      const res = await axios.get(
        `${BASE_URL}/patient/doctors/${specialization_id}/${branch}`
      );
      setDoctors(res.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      setDoctors([]);
    }
  };

  if (currentStep === 1) fetchDoctors();
}, [currentStep, bookingData.branch, bookingData.specialization]);


// Fetch available times when doctor & date are selected
useEffect(() => {
  const fetchAvailableTimes = async () => {
    try {
      const doctorId = doctors.find(
        doc => doc.Doctor_Name === bookingData.doctor
      )?.Doctor_ID;
      const date = bookingData.date;
      if (!doctorId || !date) return;

      const res = await axios.get(
        `${BASE_URL}/patient/available-timeslots/${doctorId}/${date}`
      );

      // Filter out slots with count >= 5
      const blockedSlots = res.data
        .filter(slot => slot.BookedCount >= 5)
        .map(slot => slot.Start_Time);

      const filtered = allTimeSlots.filter(time => !blockedSlots.includes(time));
      setAvailableTimes(filtered.map(formatTime));
    } catch (error) {
      console.error("Error fetching available time slots:", error);
      setAvailableTimes([]);
    }
  };

  if (currentStep === 3) fetchAvailableTimes();
}, [currentStep, bookingData.doctor, bookingData.date]);
  
  const handleNext = async () => {  
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleConfirmBooking = async () => {
    try {
      const doctorId = doctors.find(
        doc => doc.Doctor_Name === bookingData.doctor
      )?.Doctor_ID;

      // Get the string from localStorage
      const userString = localStorage.getItem('user');

      // Parse it to an object
      const user = userString ? JSON.parse(userString) : null;

      // Get the patient ID
      const patientId = user?.pid;


      const payload = {
        patientId: patientId,
        doctorId: doctorId,
        date: bookingData.date,
        startTime: bookingData.time,
        status: "Confimed",
        branch: bookingData.branch,
        type: "doctor",
        specializationId: specializations.find(
          spec => spec.Specialization_Name === bookingData.specialization
        )?.Specialization_ID
      }

      const res = await axios.post(`${BASE_URL}/patient/appointment`, payload);
      setAppointmentID(res.data.appointment_id)
      setCurrentStep(4);
    }
    catch (error) {
      console.error("Error confirming booking:", error);
    }
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
                      <SelectItem key={spec.Specialization_Name} value={spec.Specialization_Name}>{spec.Specialization_Name}</SelectItem>
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
              {bookingData.specialization && doctors.map((doctor) => (
                <Card 
                  key={doctor.Doctor_ID} 
                  className={`cursor-pointer transition-all ${bookingData.doctor === doctor.Doctor_Name ? 'ring-2 ring-primary' : 'hover:shadow-lg'}`}
                  onClick={() => setBookingData({...bookingData, doctor: doctor.Doctor_Name})}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{doctor.Doctor_Name}</h4>
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
          <div className="text-center space-y-6 content">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-success-foreground" />
            </div>
            <div>
              <h3 className="text-3xl font-bold text-success mb-2">Appointment Confirmed!</h3>
              <p className="text-muted-foreground">Your appointment has been successfully booked</p>
            </div>
            
            {/* Appointment Card */}
            <div className="bg-gradient-to-br from-card to-card/80 border-2 border-primary/20 rounded-xl p-8 text-left space-y-6 shadow-hero">
              <div className="text-center border-b border-border/50 pb-4">
                <h4 className="text-xl font-bold text-primary mb-1">APPOINTMENT CONFIRMATION</h4>
                <p className="text-sm text-muted-foreground">MedSync Healthcare System</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Doctor</p>
                        <p className="font-semibold text-lg">{bookingData.doctor}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Specialization</p>
                        <p className="font-semibold">{bookingData.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Hospital Branch</p>
                        <p className="font-semibold">{bookingData.branch}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Appointment Date</p>
                        <p className="font-semibold text-lg">{new Date(bookingData.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-info" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold text-lg">{bookingData.time}</p>
                      </div>
                    </div>
                    
                    <div className="bg-primary/5 rounded-lg p-3 border border-primary/20">
                      <p className="text-sm text-muted-foreground">Appointment ID: {appointmentID}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-border/50 pt-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h5 className="font-semibold mb-2 text-primary">Important Instructions:</h5>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Please arrive 15 minutes before your scheduled appointment</li>
                    <li>• Bring a valid ID and your insurance card (if applicable)</li>
                    <li>• A confirmation email has been sent to your registered email</li>
                    <li>• For any changes, contact us at least 24 hours in advance</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground shadow-hero no-print">
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
        <div className="container mx-auto px-6 py-6 no-print">
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
      <main className="container mx-auto px-6 pb-8 content">
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
              <div className="space-y-4 pt-6 no-print">
                <Button 
                  onClick={() => window.print()}
                  className="w-full h-12 bg-gradient-primary hover:opacity-90 text-lg font-semibold shadow-button"
                >
                  <Printer className="w-5 h-5 mr-3" />
                  Print Appointment Details
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.href = '/patient-dashboard'}
                  className="w-full h-10 border-primary/30 hover:bg-primary/10"
                >
                  Back to Dashboard
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