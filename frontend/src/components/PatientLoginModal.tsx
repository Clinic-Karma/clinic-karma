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
import { UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PatientLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PatientLoginModal = ({ open, onOpenChange }: PatientLoginModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleLogin = () => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Simulate login success
    toast({
      title: "Login Successful",
      description: "Welcome back! Redirecting to patient dashboard...",
    });

    // Here you would normally handle authentication
    // For demo purposes, we'll just close the modal
    setTimeout(() => {
      onOpenChange(false);
      // Navigate to patient dashboard
      window.location.href = '/patient-dashboard';
    }, 1500);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetForm();
    }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Patient Login</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access your appointments and medical records
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center mb-4">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Patient Portal</h3>
          </div>

          <div className="space-y-4">
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

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              Don't have an account?{' '}
              <button className="text-primary hover:text-primary-dark font-medium">
                Sign up as a new patient
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PatientLoginModal;