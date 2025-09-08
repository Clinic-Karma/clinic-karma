import { useState } from 'react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stethoscope, Users, Shield, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [adminRole, setAdminRole] = useState('');
  const { toast } = useToast();

  const roles = [
    {
      value: 'doctor',
      label: 'Doctor',
      icon: Stethoscope,
      description: 'Manage appointments and patient care'
    },
    {
      value: 'staff',
      label: 'Staff',
      icon: Users,
      description: 'Hospital operations and support'
    },
    {
      value: 'admin',
      label: 'Administrator',
      icon: Shield,
      description: 'System administration and oversight'
    }
  ];

  const handleLogin = () => {
    if (!selectedRole || !email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (selectedRole === 'staff' && !staffRole) {
      toast({
        title: "Staff Role Required",
        description: "Please select your staff role.",
        variant: "destructive",
      });
      return;
    }

    if (selectedRole === 'admin' && !adminRole) {
      toast({
        title: "Admin Role Required",
        description: "Please select your admin role.",
        variant: "destructive",
      });
      return;
    }

    // Simulate login success
    toast({
      title: "Login Successful",
      description: `Welcome back! Redirecting to ${selectedRole} dashboard...`,
    });

    // Here you would normally handle authentication
    // For demo purposes, we'll just close the modal
    setTimeout(() => {
      onOpenChange(false);
      // Navigate to appropriate dashboard based on role
      if (selectedRole === 'admin' && adminRole === 'top-manager') {
        window.location.href = '/top-manager-dashboard';
      } else {
        window.location.href = `/${selectedRole}-dashboard`;
      }
    }, 1500);
  };

  const resetForm = () => {
    setSelectedRole('');
    setEmail('');
    setPassword('');
    setStaffRole('');
    setAdminRole('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Welcome Back</DialogTitle>
          <DialogDescription className="text-center">
            Choose your role and sign in to your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedRole ? (
            <div className="grid grid-cols-2 gap-3">
              {roles.map((role) => (
                <Card 
                  key={role.value}
                  className="cursor-pointer hover:shadow-card transition-all duration-200 hover:scale-105"
                  onClick={() => setSelectedRole(role.value)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center">
                        <role.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-sm">{role.label}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-muted-foreground text-center">
                      {role.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                  {(() => {
                    const RoleIcon = roles.find(r => r.value === selectedRole)?.icon || UserCheck;
                    return <RoleIcon className="w-8 h-8 text-primary-foreground" />;
                  })()}
                </div>
                <h3 className="font-semibold text-lg">
                  {roles.find(r => r.value === selectedRole)?.label} Login
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedRole('')}
                  className="text-primary hover:text-primary-dark"
                >
                  Change Role
                </Button>
              </div>

              <div className="space-y-3">
                {selectedRole === 'admin' && (
                  <div>
                    <Label htmlFor="adminRole">Admin Role</Label>
                    <Select value={adminRole} onValueChange={setAdminRole}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your admin role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top-manager">Top Manager</SelectItem>
                        <SelectItem value="branch-manager">Branch Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="mt-1"
                  />
                </div>

                {selectedRole === 'staff' && (
                  <div>
                    <Label htmlFor="staffRole">Staff Role</Label>
                    <Select value={staffRole} onValueChange={setStaffRole}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your staff role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="receptionist">Receptionist</SelectItem>
                        <SelectItem value="lab-coordinator">Lab Coordinator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button 
                  onClick={handleLogin}
                  className="w-full bg-gradient-primary hover:opacity-90 shadow-button"
                >
                  Sign In
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  Forgot your password?{' '}
                  <button className="text-primary hover:text-primary-dark font-medium">
                    Reset it here
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;