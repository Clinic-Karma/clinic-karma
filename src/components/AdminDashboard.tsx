import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TopManagerDashboard from "./TopManagerDashboard";
import BranchManagerDashboard from "./BranchManagerDashboard";
import StaffDashboard from "./StaffDashboard";
import { UserCog, Users, Building2 } from "lucide-react";

const AdminDashboard = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedPortal, setSelectedPortal] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Choose your role" />
            </SelectTrigger>
            <SelectContent className="bg-background border border-border shadow-lg z-50">
              <SelectItem value="top-manager" className="cursor-pointer hover:bg-accent">
                <div className="flex items-center">
                  <UserCog className="w-4 h-4 mr-2" />
                  Top Manager
                </div>
              </SelectItem>
              <SelectItem value="branch-manager" className="cursor-pointer hover:bg-accent">
                <div className="flex items-center">
                  <Building2 className="w-4 h-4 mr-2" />
                  Branch Manager
                </div>
              </SelectItem>
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

  const renderLoginForm = (roleTitle: string) => (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login as {roleTitle}</CardTitle>
          <CardDescription>Enter your credentials to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Username</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="Enter username"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input 
              type="password" 
              className="w-full px-3 py-2 border border-border rounded-md bg-background"
              placeholder="Enter password"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setSelectedRole("")} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setIsLoggedIn(true)} className="flex-1">
              Login
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
          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-12 justify-start"
              onClick={() => setSelectedRole("receptionist")}
            >
              <Users className="w-5 h-5 mr-3" />
              Receptionist
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12 justify-start"
              onClick={() => setSelectedRole("lab-coordinator")}
            >
              <UserCog className="w-5 h-5 mr-3" />
              Lab Coordinator
            </Button>
          </div>
          <Button variant="outline" onClick={() => setSelectedPortal("")} className="w-full">
            Back
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDashboard = () => {
    if (selectedRole === "top-manager") {
      return <TopManagerDashboard />;
    } else if (selectedRole === "branch-manager") {
      return <BranchManagerDashboard />;
    } else if (selectedRole === "receptionist" || selectedRole === "lab-coordinator") {
      return <StaffDashboard role={selectedRole} />;
    }
    return null;
  };

  const getRoleTitle = () => {
    switch (selectedRole) {
      case "top-manager":
        return "Top Manager";
      case "branch-manager":
        return "Branch Manager";
      case "receptionist":
        return "Receptionist";
      case "lab-coordinator":
        return "Lab Coordinator";
      default:
        return "";
    }
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

  if (selectedRole && !isLoggedIn) {
    return renderLoginForm(getRoleTitle());
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <div className="bg-primary text-primary-foreground p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">MedSync - {getRoleTitle()}</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={() => {
                  setSelectedRole("");
                  setSelectedPortal("");
                  setIsLoggedIn(false);
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
  }

  return null;
};

export default AdminDashboard;