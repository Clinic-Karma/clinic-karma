import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, CreditCard, Shield, Save, UserCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const EditPatientProfile = () => {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    nic: '123456789V',
    email: 'john.doe@email.com',
    contactNumber: '+1 (555) 123-4567',
    gender: 'Male',
    dateOfBirth: '1985-01-15',
    address: '123 Main Street, Anytown, ST 12345'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    if (!formData.contactNumber.trim() || !formData.address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all editable fields.",
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

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Profile Updated!",
        description: "Your contact information has been successfully updated.",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className={`relative container mx-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-6'}`}>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => window.location.href = '/patient-dashboard'}
              className="border-primary-foreground/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 shadow-button"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="space-y-1">
              <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Edit Profile</h1>
              <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>Update your contact information</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`container mx-auto ${isMobile ? 'p-4' : 'p-8'} space-y-8`}>
        {/* Profile Overview Card */}
        <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-2xl">
              <div className="p-3 rounded-full bg-gradient-primary">
                <UserCircle className="w-6 h-6 text-primary-foreground" />
              </div>
              Patient Information
            </CardTitle>
            <p className="text-muted-foreground ml-12">View and update your profile details</p>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Read-only Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">Personal Details (Read-only)</h3>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2 lg:grid-cols-3 gap-8'}`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Full Name</Label>
                      <p className="font-semibold text-lg">{formData.fullName}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">NIC Number</Label>
                      <p className="font-semibold text-lg font-mono">{formData.nic}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                      <Mail className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Email Address</Label>
                      <p className="font-semibold">{formData.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Gender</Label>
                      <p className="font-semibold">{formData.gender}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Date of Birth</Label>
                      <p className="font-semibold">{new Date(formData.dateOfBirth).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-primary border-b border-border/50 pb-2">Contact Information (Editable)</h3>
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'md:grid-cols-2 gap-8'}`}>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <Label htmlFor="contactNumber" className="text-base font-medium">Contact Number *</Label>
                  </div>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber}
                    onChange={(e) => handleInputChange('contactNumber', e.target.value)}
                    placeholder="Enter your contact number"
                    className="h-12 text-base bg-background border-2 border-primary/20 focus:border-primary/50 transition-all duration-300"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-secondary" />
                    </div>
                    <Label htmlFor="address" className="text-base font-medium">Address *</Label>
                  </div>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Enter your complete address"
                    className="min-h-[120px] text-base bg-background border-2 border-primary/20 focus:border-primary/50 transition-all duration-300 resize-none"
                    rows={4}
                  />
                </div>
              </div>
            </div>

            {/* Notice */}
            <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <Shield className="w-4 h-4 text-info" />
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong className="text-foreground">Important Notice:</strong></p>
                  <ul className="space-y-1 ml-2">
                    <li>• Only contact number and address can be modified</li>
                    <li>• Personal details like NIC, name, and date of birth cannot be changed for security reasons</li>
                    <li>• Changes will be effective immediately after saving</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-4 justify-end'} pt-6 border-t border-border/50`}>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/patient-dashboard'}
                className={`${isMobile ? 'h-12' : 'h-11'} border-primary/30 hover:bg-primary/10 transition-all duration-300`}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isLoading}
                className={`${isMobile ? 'h-12' : 'h-11'} bg-gradient-primary hover:opacity-90 shadow-button transition-all duration-300 transform hover:scale-105`}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditPatientProfile;