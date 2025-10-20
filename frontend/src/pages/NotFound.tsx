import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const getDashboardPath = () => {
    if (!isAuthenticated) return '/';
    
    switch (user?.role) {
      case 'patient':
        return '/patient-dashboard';
      case 'doctor':
        return '/doctor-dashboard';
      case 'top-manager':
        return '/top-manager';
      case 'branch-manager':
        return '/branch-manager';
      case 'lab-coordinator':
        return '/lab-coordinator';
      case 'receptionist':
        return '/receptionist';
      default:
        return '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or you don't have permission to access it.
            </p>
            <p className="text-sm text-muted-foreground">
              Path: <code className="bg-muted px-2 py-1 rounded text-xs">{location.pathname}</code>
            </p>
          </div>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate(-1)} 
              variant="outline" 
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            {isAuthenticated ? (
              <Button 
                onClick={() => navigate(getDashboardPath())} 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Button>
            ) : (
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
