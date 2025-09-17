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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SignUpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SignUpModal = ({ open, onOpenChange }: SignUpModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    nic: '',
    contactNumber: '',
    email: '',
    gender: '',
    address: ''
  });
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date());
  const [datePickerView, setDatePickerView] = useState<'month' | 'year' | 'date'>('month');
  const [tempDate, setTempDate] = useState<Date>(new Date());
  const { toast } = useToast();

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

  const handleSignUp = () => {
    if (!formData.fullName || !formData.nic || !formData.contactNumber || !formData.email || !formData.gender || !dateOfBirth) {
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

    // Email validation (required field)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    // Phone validation
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(formData.contactNumber.replace(/\s/g, ''))) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid contact number.",
        variant: "destructive",
      });
      return;
    }

    // Simulate successful registration
    toast({
      title: "Registration Successful!",
      description: `Welcome ${formData.fullName}! Your account has been created successfully.`,
    });

    setTimeout(() => {
      onOpenChange(false);
      resetForm();
    }, 2000);
  };

  const resetForm = () => {
    setFormData({
      fullName: '',
      nic: '',
      contactNumber: '',
      email: '',
      gender: '',
      address: ''
    });
    setDateOfBirth(new Date());
    setDatePickerView('month');
    setTempDate(new Date());
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1899 }, (_, i) => currentYear - i);

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date(tempDate);
    newDate.setMonth(monthIndex);
    setTempDate(newDate);
    setDatePickerView('year');
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(tempDate);
    newDate.setFullYear(year);
    setTempDate(newDate);
    setDatePickerView('date');
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setDateOfBirth(date);
      setDatePickerView('month');
    }
  };

  const renderMonthGrid = () => (
    <div className="p-4 w-80">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newDate = new Date(tempDate);
            newDate.setFullYear(tempDate.getFullYear() - 1);
            setTempDate(newDate);
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold text-lg">{tempDate.getFullYear()}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            const newDate = new Date(tempDate);
            newDate.setFullYear(tempDate.getFullYear() + 1);
            setTempDate(newDate);
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month, index) => (
          <Button
            key={month}
            variant={tempDate.getMonth() === index ? "default" : "outline"}
            className="h-12 text-sm"
            onClick={() => handleMonthSelect(index)}
          >
            {month.substring(0, 3)}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderYearGrid = () => (
    <div className="p-4 w-80 max-h-96 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDatePickerView('month')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold text-lg">Select Year</h3>
        <div className="w-8" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {years.map((year) => (
          <Button
            key={year}
            variant={tempDate.getFullYear() === year ? "default" : "outline"}
            className="h-12 text-sm"
            onClick={() => handleYearSelect(year)}
          >
            {year}
          </Button>
        ))}
      </div>
    </div>
  );

  const renderDateGrid = () => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setDatePickerView('year')}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-semibold text-lg">
          {months[tempDate.getMonth()]} {tempDate.getFullYear()}
        </h3>
        <div className="w-8" />
      </div>
      <Calendar
        mode="single"
        selected={dateOfBirth}
        onSelect={handleDateSelect}
        month={tempDate}
        onMonthChange={setTempDate}
        disabled={(date) =>
          date > new Date() || date < new Date("1900-01-01")
        }
        className={cn("pointer-events-auto")}
        showOutsideDays={false}
      />
    </div>
  );

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
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@example.com"
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full mt-1 justify-start text-left font-normal",
                      !dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfBirth ? format(dateOfBirth, "PPP") : "Select date of birth"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  {datePickerView === 'month' && renderMonthGrid()}
                  {datePickerView === 'year' && renderYearGrid()}
                  {datePickerView === 'date' && renderDateGrid()}
                </PopoverContent>
              </Popover>
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
                // You could emit an event or use a callback to open auth modal
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