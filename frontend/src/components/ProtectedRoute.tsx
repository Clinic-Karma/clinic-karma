import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [], 
  fallbackPath = '/' 
}) => {
  const { isAuthenticated, hasAnyRole, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // If roles are required but user doesn't have any of them
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="space-y-2">
              <AlertCircle className="w-6 h-6 text-destructive mx-auto" />
              <p className="text-muted-foreground">
                You don't have permission to access this page.
              </p>
              <p className="text-sm text-muted-foreground">
                Required roles: {requiredRoles.join(', ')}
              </p>
            </div>
            <div className="space-y-2">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline" 
                className="w-full"
              >
                Go Back
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                className="w-full"
              >
                Go Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;


