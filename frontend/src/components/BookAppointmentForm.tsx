import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const BookAppointmentForm = () => {
  const { toast } = useToast();
  
  // State for form
  const [bookDate, setBookDate] = useState<Date>();
  const [bookSpecialization, setBookSpecialization] = useState("");
  const [bookPatientUsername, setBookPatientUsername] = useState("");
  const [bookDoctor, setBookDoctor] = useState("");
  
  // State for dynamic data
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [doctorsList, setDoctorsList] = useState<string[]>([]);
  
  // Fetch specializations on component mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/appointments/specializations');
        setSpecializations(response.data.map((spec: any) => spec.name));
      } catch (error) {
        console.error('Error fetching specializations:', error);
        toast({ title: "Error", description: "Failed to load specializations" });
      }
    };
    fetchSpecializations();
  }, []);

  // Fetch doctors when specialization changes
  useEffect(() => {
    const fetchDoctors = async () => {
      if (bookSpecialization) {
        try {
          const response = await axios.get(`http://localhost:5000/api/appointments/doctors/${bookSpecialization}`);
          setDoctorsList(response.data.map((doc: any) => doc.name));
        } catch (error) {
          console.error('Error fetching doctors:', error);
          toast({ title: "Error", description: "Failed to load doctors" });
        }
      }
    };
    fetchDoctors();
  }, [bookSpecialization]);

  // Handle appointment booking
  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookPatientUsername || !bookDoctor || !bookSpecialization || !bookDate) {
      toast({ title: "Error", description: "Please fill all required fields" });
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/appointments/book', {
        patientUsername: bookPatientUsername,
        doctor: bookDoctor,
        specialization: bookSpecialization,
        date: format(bookDate, 'yyyy-MM-dd')
      });

      toast({ title: "Success", description: "Appointment booked successfully" });
      
      // Reset form
      setBookPatientUsername('');
      setBookDoctor('');
      setBookSpecialization('');
      setBookDate(undefined);
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.response?.data?.message || "Failed to book appointment" 
      });
    }
  };

  return (
    <form onSubmit={handleBookAppointment} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bookPatientUsername">Patient Username</Label>
        <Input 
          id="bookPatientUsername" 
          placeholder="Enter patient username" 
          value={bookPatientUsername}
          onChange={(e) => setBookPatientUsername(e.target.value)}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="bookSpecialization">Specialization</Label>
        <Select value={bookSpecialization} onValueChange={(value) => {
          setBookSpecialization(value);
          setBookDoctor(""); // Reset doctor when specialization changes
        }} required>
          <SelectTrigger>
            <SelectValue placeholder="Select specialization" />
          </SelectTrigger>
          <SelectContent>
            {specializations.map((spec) => (
              <SelectItem key={spec} value={spec}>{spec}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="bookDoctor">Doctor</Label>
        <Select value={bookDoctor} onValueChange={setBookDoctor} required disabled={!bookSpecialization}>
          <SelectTrigger>
            <SelectValue placeholder="Select doctor" />
          </SelectTrigger>
          <SelectContent>
            {doctorsList.map((doctor) => (
              <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Appointment Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !bookDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {bookDate ? format(bookDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={bookDate}
              onSelect={setBookDate}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <Button type="submit" className="w-full">Book Appointment</Button>
    </form>
  );
};