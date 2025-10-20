import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite

interface SignUpModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onOpenLogin: () => void;
}

const SignUpModal = ({ open, onOpenChange, onOpenLogin }: SignUpModalProps) => {
    const [formData, setFormData] = useState({
      fullName: '',
      nic: '',
      contactNumber: '',
      username: '',
      gender: '',
      address: '',
      password: '',
      role: '',
      emmergencyContact: ''
    });
    
    // Initialize with today's date
    const today = new Date();
    const [dateOfBirth, setDateOfBirth] = useState({
      month: (today.getMonth() + 1).toString(),
      day: today.getDate().toString(),
      year: today.getFullYear().toString()
    });
    
    const { toast } = useToast();

    // Generate arrays for dropdowns
    const months = [
      { value: '1', label: 'January' },
      { value: '2', label: 'February' },
      { value: '3', label: 'March' },
      { value: '4', label: 'April' },
      { value: '5', label: 'May' },
      { value: '6', label: 'June' },
      { value: '7', label: 'July' },
      { value: '8', label: 'August' },
      { value: '9', label: 'September' },
      { value: '10', label: 'October' },
      { value: '11', label: 'November' },
      { value: '12', label: 'December' }
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
    
    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month, 0).getDate();
    };
    
    const daysInMonth = getDaysInMonth(parseInt(dateOfBirth.month), parseInt(dateOfBirth.year));
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    // Clear form when modal opens
    useEffect(() => {
      if (open) {
        resetForm();
      }
    }, [open]);

    const handleInputChange = (field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const validateNIC = (nic: string) => {
      // Basic NIC validation - can be enhanced based on country requirements
      const nicRegex = /^[0-9]{9}[vVxX]$|^[0-9]{12}$/;
      return nicRegex.test(nic.replace(/\s/g, ''));
    };

    function checkPasswordStrength(password) {
      const minLength = /.{8,}/;                // at least 8 characters
      const upper = /[A-Z]/;                   // at least one uppercase
      const lower = /[a-z]/;                   // at least one lowercase
      const number = /[0-9]/;                  // at least one number
      const special = /[!@#$%^&*(),.?":{}|<>]/; // at least one special char

      let score = 0;
      if (minLength.test(password)) score++;
      if (upper.test(password)) score++;
      if (lower.test(password)) score++;
      if (number.test(password)) score++;
      if (special.test(password)) score++;

      return score;
  }


  const handleSignUp = async () => {
    if (!formData.fullName || !formData.nic || !formData.contactNumber || !formData.username || !formData.gender || !dateOfBirth.month || !dateOfBirth.day || !dateOfBirth.year || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // NIC validation
    if (!validateNIC(formData.nic)) {
      toast({
        title: "Invalid NIC",
        description: "Please enter a valid National Identity Card number.",
        variant: "destructive",
      });
      return;
    }

    // Phone validation
    const phoneRegex = /^(?:\+94|0)\d{9}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid contact number.",
        variant: "destructive",
      });
      return;
    }

    //Check Password strength
    const strength = checkPasswordStrength(formData.password);
    if (strength < 3) {
      toast({
        title: "Password is not strong enough!",
        variant: "destructive",
      });
      return;
    }

    // Prepare payload for Neon backend
    const payload = {
      name: formData.fullName,
      username: formData.username, // You can split first/last name if needed
      nic: formData.nic,
      contact_number: formData.contactNumber,
      address: formData.address,
      password: formData.password,
      dob: `${dateOfBirth.year}-${dateOfBirth.month.padStart(2, '0')}-${dateOfBirth.day.padStart(2, '0')}`,
      emergencyContact: formData.emmergencyContact,
      gender: formData.gender
    };

    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register-patient`, payload, {
        withCredentials: true
      });
      toast({
        title: "Registration Successful!",
        description: `Welcome ${formData.username}! Your account has been created successfully.`,
      });
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
      }, 2000);

    } catch (err) {
      console.log(err);
      toast({
        title: "Registration Failed!",
        description: err.response?.data?.error || err.response?.data?.message || err.message,
        variant: "destructive"
      });
    }

  };


  const resetForm = () => {
    setFormData({
      fullName: '',
      nic: '',
      contactNumber: '',
      username: '',
      gender: '',
      address: '',
      password: '',
      role: '',
      emmergencyContact: ''
    });

    const today = new Date();
    setDateOfBirth({
      month: (today.getMonth() + 1).toString(),
      day: today.getDate().toString(),
      year: today.getFullYear().toString()
    });
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Join MedSync</DialogTitle>
          <DialogDescription className="text-center">
            Create your patient account to start managing your healthcare
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="Enter your full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="nic">National Identity Card (NIC) *</Label>
              <Input
                id="nic"
                value={formData.nic}
                onChange={(e) => handleInputChange('nic', e.target.value)}
                placeholder="Enter your NIC number"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="username"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                placeholder="username"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="password"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="contactNumber">Contact Number *</Label>
              <Input
                id="contactNumber"
                value={formData.contactNumber}
                onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="emmergencyContact">Emmergency Contact Number</Label>
              <Input
                id="emmergencyContact"
                value={formData.emmergencyContact}
                onChange={(e) => handleInputChange('emmergencyContact', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Date of Birth *</Label>
              <div className="grid grid-cols-3 gap-2 mt-1">
                <Select 
                  value={dateOfBirth.month} 
                  onValueChange={(value) => {
                    setDateOfBirth(prev => ({ ...prev, month: value }));
                    // Adjust day if it's invalid for the new month
                    const newDaysInMonth = getDaysInMonth(parseInt(value), parseInt(dateOfBirth.year));
                    if (parseInt(dateOfBirth.day) > newDaysInMonth) {
                      setDateOfBirth(prev => ({ ...prev, day: newDaysInMonth.toString() }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {months.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={dateOfBirth.day} 
                  onValueChange={(value) => setDateOfBirth(prev => ({ ...prev, day: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {days.map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={dateOfBirth.year} 
                  onValueChange={(value) => {
                    setDateOfBirth(prev => ({ ...prev, year: value }));
                    // Adjust day if it's invalid for the new year (leap year consideration)
                    const newDaysInMonth = getDaysInMonth(parseInt(dateOfBirth.month), parseInt(value));
                    if (parseInt(dateOfBirth.day) > newDaysInMonth) {
                      setDateOfBirth(prev => ({ ...prev, day: newDaysInMonth.toString() }));
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Enter your complete address"
              className="mt-1 resize-none"
              rows={3}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">
              <strong>Note:</strong> Fields marked with * are required.
            </p>
            <p className="text-xs text-muted-foreground">
              Your information is secure and will only be used for healthcare management purposes.
            </p>
          </div>

          <Button 
            onClick={handleSignUp}
            className="w-full bg-gradient-primary hover:opacity-90 shadow-button"
          >
            Create Patient Account
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button 
              className="text-primary hover:text-primary-dark font-medium"
              onClick={() => {
                onOpenChange(false);
                onOpenLogin();
              }}
            >
              Sign in here
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignUpModal;