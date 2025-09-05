import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Eye
} from "lucide-react";

const AdminDashboardContent = () => {
  const [activeTab, setActiveTab] = useState("security");

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Administrator Dashboard</h2>
        <p className="text-muted-foreground mt-2">Manage your healthcare system administration</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security & Settings
          </TabsTrigger>
          <TabsTrigger value="insurance" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Insurance Management
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            User & Role Management
          </TabsTrigger>
          <TabsTrigger value="doctors" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Doctor Management
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            System Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="security" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
                <CardDescription>Configure system security policies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Two-Factor Authentication</span>
                  <Badge variant="secondary">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Session Timeout</span>
                  <Badge variant="outline">30 minutes</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Password Policy</span>
                  <Badge variant="secondary">Strong</Badge>
                </div>
                <Button className="w-full mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Configuration</CardTitle>
                <CardDescription>General system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>System Maintenance Mode</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Backup Schedule</span>
                  <Badge variant="secondary">Daily</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Data Retention</span>
                  <Badge variant="outline">7 years</Badge>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Configure System
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Insurance Providers</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Insurance Provider
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {["Blue Cross Blue Shield", "Aetna", "Cigna", "UnitedHealthcare", "Humana"].map((provider, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{provider}</CardTitle>
                    <CardDescription>Active Insurance Provider</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span>Status</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">User & Role Management</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Staff Roles</CardTitle>
                  <CardDescription>Manage staff permissions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Receptionist</span>
                    <Badge variant="secondary">12 users</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Lab Coordinator</span>
                    <Badge variant="secondary">5 users</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Nurse</span>
                    <Badge variant="secondary">8 users</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Manage Roles
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Currently logged in</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-primary mb-2">23</div>
                  <p className="text-sm text-muted-foreground">Users online</p>
                  <Button variant="outline" className="w-full mt-4">
                    View Details
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>Access control</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Read Access</span>
                    <Badge variant="default">All</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Write Access</span>
                    <Badge variant="secondary">Limited</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Admin Access</span>
                    <Badge variant="destructive">Restricted</Badge>
                  </div>
                  <Button variant="outline" className="w-full mt-4">
                    Configure
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="doctors" className="mt-6">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Doctor Management</h3>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Doctor
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Dr. Sarah Johnson", specialty: "Cardiology", status: "Active" },
                { name: "Dr. Michael Chen", specialty: "Neurology", status: "Active" },
                { name: "Dr. Emily Davis", specialty: "Pediatrics", status: "On Leave" },
                { name: "Dr. Robert Wilson", specialty: "Orthopedics", status: "Active" },
                { name: "Dr. Lisa Thompson", specialty: "Dermatology", status: "Active" },
                { name: "Dr. James Rodriguez", specialty: "Emergency Medicine", status: "Active" }
              ].map((doctor, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{doctor.name}</CardTitle>
                    <CardDescription>{doctor.specialty}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <span>Status</span>
                      <Badge variant={doctor.status === "Active" ? "default" : "secondary"}>
                        {doctor.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">System-wide Reports</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Patient Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">1,247</div>
                  <p className="text-sm text-muted-foreground">Total Patients</p>
                  <Button variant="outline" className="w-full mt-4">
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">856</div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <Button variant="outline" className="w-full mt-4">
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">$124K</div>
                  <p className="text-sm text-muted-foreground">Monthly Total</p>
                  <Button variant="outline" className="w-full mt-4">
                    View Report
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-2">94%</div>
                  <p className="text-sm text-muted-foreground">Uptime</p>
                  <Button variant="outline" className="w-full mt-4">
                    View Report
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Reports</CardTitle>
                <CardDescription>Generate common system reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Button variant="outline">Daily Summary</Button>
                  <Button variant="outline">Weekly Analytics</Button>
                  <Button variant="outline">Monthly Performance</Button>
                  <Button variant="outline">Annual Review</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardContent;