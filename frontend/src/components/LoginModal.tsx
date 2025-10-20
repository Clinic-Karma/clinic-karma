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
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

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
  const { login } = useAuth();
  const navigate = useNavigate();

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
      const success = await login(username, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: "Welcome back! Redirecting to your dashboard...",
        });
        
        // Close modal
        onOpenChange(false);
        
        // Redirect based on user role
        const userString = localStorage.getItem('user');
        if (userString) {
          const user = JSON.parse(userString);
          switch (user.role) {
            case 'patient':
              navigate('/patient-dashboard');
              break;
            case 'doctor':
              navigate('/doctor-dashboard');
              break;
            case 'top-manager':
              navigate('/top-manager');
              break;
            case 'branch-manager':
              navigate('/branch-manager');
              break;
            case 'lab-coordinator':
              navigate('/lab-coordinator');
              break;
            case 'receptionist':
              navigate('/receptionist');
              break;
            default:
              navigate('/');
          }
        }
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid username or password. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
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
