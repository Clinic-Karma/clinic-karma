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
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite


interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginModal = ({ open, onOpenChange }: LoginModalProps) => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!username || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE_URL}auth/login`,
        {
          username,
          password,
        }
      );

      const { user } = res.data;

      localStorage.setItem('user', JSON.stringify(user));

      toast({
        title: "Login Successful",
        description: `Welcome back, ${user.username}! Redirecting...`,
      });

      // Redirect based on role
      setTimeout(() => {
        onOpenChange(false);

        switch (user.role) {
          case "patient":
            window.location.href = "/patient-dashboard";
            break;
          case "doctor":
            window.location.href = "/doctor-dashboard";
            break;
          case "lab-assistant":
            window.location.href = "/lab-coordinator";
            break;
          case "receptionist":
            window.location.href = "/receptionist";
            break;
          case "branch-manager":
            window.location.href = "/branch-manager";
            break;
          case "top-manager":
            window.location.href = "/top-manager";
            break;
          default:
            window.location.href = "/";
        }
      }, 500);

    } catch (err: any) {
      console.error(err);
      
      // Handle account lockout
      if (err.response?.status === 423) {
        toast({
          title: "Account Locked",
          description: err.response?.data?.message || "Too many failed attempts. Please try again later.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login Failed",
          description: err.response?.data?.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setUserName('');
    setPassword('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetForm();
      }}
    >
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Login</DialogTitle>
          <DialogDescription className="text-center">
            Sign in to access your account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center mb-4">
            <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <h3 className="font-semibold text-lg">Welcome Back</h3>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your username"
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
              disabled={loading}
              className="w-full bg-gradient-primary hover:opacity-90 shadow-button"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Forgot your password?{' '}
              <button className="text-primary hover:text-primary-dark font-medium">
                Reset it here
              </button>
            </div>

            <div className="text-center text-sm text-muted-foreground border-t pt-4">
              Don&apos;t have an account?{' '}
              <button className="text-primary hover:text-primary-dark font-medium">
                Sign up
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
