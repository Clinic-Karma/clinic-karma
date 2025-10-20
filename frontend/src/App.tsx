import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./components/LandingPage";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import TopManagerDashboard from "./components/TopManagerDashboard";
import BranchManagerDashboard from "./components/BranchManagerDashboard";
import LabCoordinatorDashboard from "./components/LabCoordinatorDashboard";
import ReceptionistDashboard from "./components/ReceptionistDashboard";
import AppointmentBooking from "./components/AppointmentBooking";
import EditPatientProfile from "./pages/EditPatientProfile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
        <Routes>
            {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
            
            {/* Protected routes with role-based access */}
            <Route 
              path="/patient-dashboard" 
              element={
                <ProtectedRoute requiredRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/doctor-dashboard" 
              element={
                <ProtectedRoute requiredRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/appointment-booking" 
              element={
                <ProtectedRoute requiredRoles={['patient']}>
                  <AppointmentBooking />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/edit-profile" 
              element={
                <ProtectedRoute requiredRoles={['patient']}>
                  <EditPatientProfile />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/top-manager" 
              element={
                <ProtectedRoute requiredRoles={['top-manager']}>
                  <TopManagerDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/branch-manager" 
              element={
                <ProtectedRoute requiredRoles={['branch-manager']}>
                  <BranchManagerDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/lab-coordinator" 
              element={
                <ProtectedRoute requiredRoles={['lab-coordinator']}>
                  <LabCoordinatorDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/receptionist" 
              element={
                <ProtectedRoute requiredRoles={['receptionist']}>
                  <ReceptionistDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Legacy admin route - redirect to appropriate dashboard */}
            <Route 
              path="/staff-dashboard" 
              element={
                <ProtectedRoute requiredRoles={['top-manager', 'branch-manager', 'lab-coordinator', 'receptionist']}>
                  <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1>
                      <p className="text-muted-foreground">Please use your specific role dashboard</p>
                    </div>
                  </div>
                </ProtectedRoute>
              } 
            />
            
            {/* Catch all route */}
        <Route path="*" element={<NotFound />} />
        </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
