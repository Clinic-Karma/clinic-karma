import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
          <Route path="/appointment-booking" element={<AppointmentBooking />} />
          <Route path="/edit-profile" element={<EditPatientProfile />} />
          <Route path="/staff-dashboard" element={<div className="min-h-screen bg-background flex items-center justify-center"><div className="text-center"><h1 className="text-2xl font-bold mb-4">Staff Dashboard</h1><p className="text-muted-foreground">Coming Soon - Staff features will be implemented here</p></div></div>} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/top-manager" element={<TopManagerDashboard />} />
        <Route path="/branch-manager" element={<BranchManagerDashboard />} />
        <Route path="/lab-coordinator" element={<LabCoordinatorDashboard />} />
        <Route path="/receptionist" element={<ReceptionistDashboard />} />
        <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
