import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminDashboardContent from "./AdminDashboardContent";
import TopManagerDashboard from "./TopManagerDashboard";
import BranchManagerDashboard from "./BranchManagerDashboard";
import StaffDashboard from "./StaffDashboard";
import { UserCog, Users, Building2 } from "lucide-react";

const AdminDashboard = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPortal, setSelectedPortal] = useState("");

  const renderRoleSelection = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">MedSync Portal</CardTitle>
          <CardDescription>Select your access level to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 justify-start"
              onClick={() => setSelectedPortal("admin")}
            >
              <UserCog className="w-5 h-5 mr-3" />
              Admin Portal
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 justify-start"
              onClick={() => setSelectedPortal("staff")}
            >
              <Users className="w-5 h-5 mr-3" />
              Staff Portal
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdminRoleSelection = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Admin Portal</CardTitle>
          <CardDescription>Select your administrative role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="administrator">Administrator</SelectItem>
              <SelectItem value="top-manager">Top Manager</SelectItem>
              <SelectItem value="branch-manager">Branch Manager</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedPortal("")} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={() => setSelectedRole(selectedRole)} 
              disabled={!selectedRole}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStaffRoleSelection = () => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Staff Portal</CardTitle>
          <CardDescription>Select your staff role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedRole}>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="receptionist">Receptionist</SelectItem>
              <SelectItem value="lab-coordinator">Lab Coordinator</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedPortal("")} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={() => setSelectedRole(selectedRole)} 
              disabled={!selectedRole}
              className="flex-1"
            >
              Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => {
    if (selectedRole === "administrator") {
      return <AdminDashboardContent />;
    } else if (selectedRole === "top-manager") {
      return <TopManagerDashboard />;
    } else if (selectedRole === "branch-manager") {
      return <BranchManagerDashboard />;
    } else if (selectedRole === "receptionist" || selectedRole === "lab-coordinator") {
      return <StaffDashboard role={selectedRole} />;
    }
    return null;
  };

  if (!selectedPortal) {
    return renderRoleSelection();
  }

  if (selectedPortal === "admin" && !selectedRole) {
    return renderAdminRoleSelection();
  }

  if (selectedPortal === "staff" && !selectedRole) {
    return renderStaffRoleSelection();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold">MedSync - {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1).replace('-', ' ')}</h1>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => {
                setSelectedRole("");
                setSelectedPortal("");
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
      {renderDashboard()}
    </div>
  );
};

export default AdminDashboard;