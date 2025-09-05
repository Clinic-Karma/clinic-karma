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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const renderLoginForm = () => {
    const isAdminPortal = selectedPortal === "admin";
    const title = isAdminPortal ? "Administrator Login" : "Staff Login";
    const roleOptions = isAdminPortal 
      ? [
          { value: "top-manager", label: "Top Manager", icon: UserCog },
          { value: "branch-manager", label: "Branch Manager", icon: Building2 }
        ]
      : [
          { value: "receptionist", label: "Receptionist", icon: Users },
          { value: "lab-coordinator", label: "Lab Coordinator", icon: UserCog }
        ];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>Enter your credentials to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Login As</label>
              <Select onValueChange={setSelectedRole} value={selectedRole}>
                <SelectTrigger className="w-full bg-background">
                  <SelectValue placeholder="Choose your role" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border shadow-lg z-50">
                  {roleOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value} className="cursor-pointer hover:bg-accent">
                        <div className="flex items-center">
                          <IconComponent className="w-4 h-4 mr-2" />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Enter email address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
                placeholder="Enter password"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedPortal("");
                  setSelectedRole("");
                  setEmail("");
                  setPassword("");
                }} 
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={() => setIsLoggedIn(true)} 
                disabled={!selectedRole || !email || !password} 
                className="flex-1"
              >
                Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

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

  if ((selectedPortal === "admin" || selectedPortal === "staff") && !isLoggedIn) {
    return renderLoginForm();
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
                  setEmail("");
                  setPassword("");
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