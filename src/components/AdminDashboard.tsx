import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  Shield, 
  CreditCard, 
  Users, 
  UserCheck, 
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  Eye,
  User,
  Bell,
  LogOut,
  Home
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("security");
  const isMobile = useIsMobile();

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className={`relative container mx-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-8'}`}>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Administrator Dashboard</h1>
              <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>Manage your healthcare system administration</p>
            </div>
            <div className="flex gap-2 items-center">
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'} 
                className={`border-primary-foreground/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 shadow-button ${isMobile ? 'px-3' : ''}`}
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={`border-primary-foreground/20 bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 shadow-button ${isMobile ? 'px-3' : 'px-4'}`}
                  >
                    Admin
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-sm border-border/50">
                  <DropdownMenuItem className="hover:bg-primary/10">
                    <User className="w-4 h-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-primary/10">
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.location.href = '/'} className="hover:bg-destructive/10 text-destructive">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="flex min-h-screen">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <aside className="w-72 bg-gradient-to-b from-card via-card/95 to-muted/20 border-r border-border/50 shadow-lg backdrop-blur-sm">
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">Navigation</h3>
                <div className="h-1 w-12 bg-gradient-primary rounded-full"></div>
              </div>
              <nav className="space-y-3">
                <button
                  onClick={() => setActiveTab('security')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'security' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'security' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Security & Settings</span>
                </button>
                <button
                  onClick={() => setActiveTab('insurance')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'insurance' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'insurance' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Insurance</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'users' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'users' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="font-medium">User & Roles</span>
                </button>
                <button
                  onClick={() => setActiveTab('doctors')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'doctors' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'doctors' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Doctors</span>
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'reports' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'reports' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Reports</span>
                </button>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

          <TabsContent value="security" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Security & Settings</h2>
              <p className="text-muted-foreground mb-8">Configure system security policies and general settings</p>
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-6`}>
              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 rounded-full bg-gradient-primary">
                      <Shield className="w-6 h-6 text-primary-foreground" />
                    </div>
                    Security Settings
                  </CardTitle>
                  <CardDescription>Configure system security policies</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                    <span>Two-Factor Authentication</span>
                    <Badge variant="secondary">Enabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                    <span>Session Timeout</span>
                    <Badge variant="outline">30 minutes</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                    <span>Password Policy</span>
                    <Badge variant="secondary">Strong</Badge>
                  </div>
                  <Button className="w-full mt-4 bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105">
                    <Settings className="w-4 h-4 mr-2" />
                    Update Security Settings
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 rounded-full bg-gradient-secondary">
                      <Settings className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    System Configuration
                  </CardTitle>
                  <CardDescription>General system settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                    <span>System Maintenance Mode</span>
                    <Badge variant="outline">Disabled</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                    <span>Backup Schedule</span>
                    <Badge variant="secondary">Daily</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                    <span>Data Retention</span>
                    <Badge variant="outline">7 years</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                    Configure System
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insurance" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Insurance Management</h2>
              <p className="text-muted-foreground mb-8">Manage insurance providers and claims</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Insurance Providers</h3>
                <Button className="bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Insurance Provider
                </Button>
              </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
                {["Blue Cross Blue Shield", "Aetna", "Cigna", "UnitedHealthcare", "Humana"].map((provider, index) => (
                  <Card key={index} className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <CardHeader>
                      <CardTitle className="text-lg">{provider}</CardTitle>
                      <CardDescription>Active Insurance Provider</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gradient-to-r from-background to-muted/10">
                        <span>Status</span>
                        <Badge variant="default">Active</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">User & Role Management</h2>
              <p className="text-muted-foreground mb-8">Manage users, roles, and permissions</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">User & Role Management</h3>
                <Button className="bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>

              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'} gap-6`}>
                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-primary">
                        <Users className="w-5 h-5 text-primary-foreground" />
                      </div>
                      Staff Roles
                    </CardTitle>
                    <CardDescription>Manage staff permissions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                      <span>Receptionist</span>
                      <Badge variant="secondary">12 users</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                      <span>Lab Coordinator</span>
                      <Badge variant="secondary">5 users</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                      <span>Nurse</span>
                      <Badge variant="secondary">8 users</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                      Manage Roles
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-secondary">
                        <BarChart3 className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      Active Users
                    </CardTitle>
                    <CardDescription>Currently logged in</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-primary mb-2">23</div>
                    <p className="text-sm text-muted-foreground">Users online</p>
                    <Button variant="outline" className="w-full mt-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                      View Details
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success">
                        <Shield className="w-5 h-5 text-success-foreground" />
                      </div>
                      Permissions
                    </CardTitle>
                    <CardDescription>Access control</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                      <span>Read Access</span>
                      <Badge variant="default">All</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                      <span>Write Access</span>
                      <Badge variant="secondary">Limited</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-background to-muted/10 hover:shadow-md transition-all duration-300">
                      <span>Admin Access</span>
                      <Badge variant="destructive">Restricted</Badge>
                    </div>
                    <Button variant="outline" className="w-full mt-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                      Configure
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Doctor Management</h2>
              <p className="text-muted-foreground mb-8">Manage doctors and their information</p>
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold">Doctor Management</h3>
                <Button className="bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Doctor
                </Button>
              </div>

              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
                {[
                  { name: "Dr. Sarah Johnson", specialty: "Cardiology", status: "Active" },
                  { name: "Dr. Michael Chen", specialty: "Neurology", status: "Active" },
                  { name: "Dr. Emily Davis", specialty: "Pediatrics", status: "On Leave" },
                  { name: "Dr. Robert Wilson", specialty: "Orthopedics", status: "Active" },
                  { name: "Dr. Lisa Thompson", specialty: "Dermatology", status: "Active" },
                  { name: "Dr. James Rodriguez", specialty: "Emergency Medicine", status: "Active" }
                ].map((doctor, index) => (
                  <Card key={index} className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <CardHeader>
                      <CardTitle className="text-lg">{doctor.name}</CardTitle>
                      <CardDescription>{doctor.specialty}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-gradient-to-r from-background to-muted/10">
                        <span>Status</span>
                        <Badge variant={doctor.status === "Active" ? "default" : "secondary"}>
                          {doctor.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">System-wide Reports</h2>
              <p className="text-muted-foreground mb-8">View system statistics and generate reports</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold">System-wide Reports</h3>
              
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-primary">
                        <Users className="w-5 h-5 text-primary-foreground" />
                      </div>
                      Patient Statistics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">1,247</div>
                    <p className="text-sm text-muted-foreground">Total Patients</p>
                    <Button variant="outline" className="w-full mt-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                      View Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-gradient-secondary">
                        <BarChart3 className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      Appointments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">856</div>
                    <p className="text-sm text-muted-foreground">This Month</p>
                    <Button variant="outline" className="w-full mt-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                      View Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-success">
                        <CreditCard className="w-5 h-5 text-success-foreground" />
                      </div>
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">$124K</div>
                    <p className="text-sm text-muted-foreground">Monthly Total</p>
                    <Button variant="outline" className="w-full mt-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                      View Report
                    </Button>
                  </CardContent>
                </Card>

                <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-warning">
                        <BarChart3 className="w-5 h-5 text-warning-foreground" />
                      </div>
                      System Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary mb-2">94%</div>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <Button variant="outline" className="w-full mt-4 hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">
                      View Report
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-primary">
                      <BarChart3 className="w-5 h-5 text-primary-foreground" />
                    </div>
                    Quick Reports
                  </CardTitle>
                  <CardDescription>Generate common system reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'} gap-4`}>
                    <Button variant="outline" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">Daily Summary</Button>
                    <Button variant="outline" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">Weekly Analytics</Button>
                    <Button variant="outline" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">Monthly Performance</Button>
                    <Button variant="outline" className="hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 transition-all duration-300">Annual Review</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 shadow-hero z-50">
          <div className="grid grid-cols-5 gap-1 p-2">
            <button
              onClick={() => setActiveTab('security')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                activeTab === 'security' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span className="text-xs font-medium">Security</span>
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                activeTab === 'insurance' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span className="text-xs font-medium">Insurance</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                activeTab === 'users' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium">Users</span>
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                activeTab === 'doctors' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span className="text-xs font-medium">Doctors</span>
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                activeTab === 'reports' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="text-xs font-medium">Reports</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;