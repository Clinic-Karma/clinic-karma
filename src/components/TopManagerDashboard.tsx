import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  BarChart3, 
  CreditCard, 
  Shield, 
  Users, 
  TrendingUp,
  FileText,
  Plus,
  Settings,
  Database,
  Eye,
  Home,
  Bell,
  LogOut,
  User
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";

const TopManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [reportsView, setReportsView] = useState("");
  const isMobile = useIsMobile();

  // Sample data for charts
  const revenueData = [
    { name: 'Jan', daily: 4000, monthly: 120000 },
    { name: 'Feb', daily: 3000, monthly: 90000 },
    { name: 'Mar', daily: 5000, monthly: 150000 },
    { name: 'Apr', daily: 4500, monthly: 135000 },
    { name: 'May', daily: 6000, monthly: 180000 },
    { name: 'Jun', daily: 5500, monthly: 165000 }
  ];

  const insuranceClaimsData = [
    { name: 'Approved', value: 65, fill: '#10b981' },
    { name: 'Pending', value: 25, fill: '#f59e0b' },
    { name: 'Rejected', value: 10, fill: '#ef4444' }
  ];

  // Sample patient data
  const patientBillsData = [
    { id: 1, name: "John Doe", amount: "$1,250", status: "Paid", date: "2024-01-15" },
    { id: 2, name: "Jane Smith", amount: "$850", status: "Pending", date: "2024-01-14" },
    { id: 3, name: "Mike Johnson", amount: "$2,100", status: "Paid", date: "2024-01-13" },
    { id: 4, name: "Sarah Wilson", amount: "$675", status: "Overdue", date: "2024-01-12" }
  ];

  const appointmentsData = [
    { id: 1, patient: "John Doe", doctor: "Dr. Smith", date: "2024-01-15", time: "10:00 AM", status: "Completed" },
    { id: 2, patient: "Jane Smith", doctor: "Dr. Johnson", date: "2024-01-15", time: "2:00 PM", status: "Scheduled" },
    { id: 3, patient: "Mike Johnson", doctor: "Dr. Brown", date: "2024-01-14", time: "11:30 AM", status: "Completed" },
    { id: 4, patient: "Sarah Wilson", doctor: "Dr. Davis", date: "2024-01-14", time: "3:15 PM", status: "Cancelled" }
  ];

  const halfPaymentData = [
    { id: 1, patient: "Robert Brown", amount: "$500", remaining: "$500", dueDate: "2024-01-20" },
    { id: 2, patient: "Lisa Davis", amount: "$300", remaining: "$300", dueDate: "2024-01-22" },
    { id: 3, patient: "Tom Wilson", amount: "$750", remaining: "$375", dueDate: "2024-01-25" }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded border">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded border">
          <p className="font-medium">{`${payload[0].name}: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className={`relative container mx-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-8'}`}>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Top Manager Dashboard</h1>
              <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>System-wide oversight and management</p>
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
                    Profile
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
                  <span className="font-medium">System Reports</span>
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
                  <span className="font-medium">Security</span>
                </button>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

            <TabsContent value="reports" className="space-y-8">
              {!reportsView ? (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">System Wide Reports</h2>
                    <p className="text-muted-foreground mb-8">Comprehensive overview of hospital operations</p>
                  </div>
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-3 gap-6'}`}>
                    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20" onClick={() => setReportsView("patients")}>
                      <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-gradient-primary">
                            <Users className="w-6 h-6 text-primary-foreground" />
                          </div>
                          Total Patients
                        </CardTitle>
                        <CardDescription>View patient bills and appointments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary mb-2">1,247</div>
                        <p className="text-sm text-muted-foreground">Active patients</p>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-success/5 to-accent/5 border-success/20" onClick={() => setReportsView("revenue")}>
                      <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-success">
                            <TrendingUp className="w-6 h-6 text-success-foreground" />
                          </div>
                          Revenue & Billing
                        </CardTitle>
                        <CardDescription>Income trends and pending payments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary mb-2">$124K</div>
                        <p className="text-sm text-muted-foreground">Monthly revenue</p>
                      </CardContent>
                    </Card>

                    <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20" onClick={() => setReportsView("insurance")}>
                      <CardHeader className="pb-6">
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-3 rounded-full bg-gradient-secondary">
                            <BarChart3 className="w-6 h-6 text-secondary-foreground" />
                          </div>
                          Insurance Claims
                        </CardTitle>
                        <CardDescription>Claims summaries and analytics</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold text-primary mb-2">856</div>
                        <p className="text-sm text-muted-foreground">Total claims</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <Button variant="outline" onClick={() => setReportsView("")}>
                    ← Back to Reports
                  </Button>
                </div>

                {reportsView === "patients" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Patient Bills & Appointments</h2>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Patient Bills</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {patientBillsData.map((bill) => (
                              <TableRow key={bill.id}>
                                <TableCell>{bill.name}</TableCell>
                                <TableCell>{bill.amount}</TableCell>
                                <TableCell>
                                  <Badge variant={bill.status === "Paid" ? "default" : bill.status === "Pending" ? "secondary" : "destructive"}>
                                    {bill.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>{bill.date}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Appointments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient</TableHead>
                              <TableHead>Doctor</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Time</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {appointmentsData.map((appointment) => (
                              <TableRow key={appointment.id}>
                                <TableCell>{appointment.patient}</TableCell>
                                <TableCell>{appointment.doctor}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>
                                  <Badge variant={appointment.status === "Completed" ? "default" : appointment.status === "Scheduled" ? "secondary" : "destructive"}>
                                    {appointment.status}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {reportsView === "revenue" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Revenue & Billing Analytics</h2>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Income Trends</CardTitle>
                        <CardDescription>Daily and monthly revenue overview</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip content={<CustomTooltip />} />
                            <Line type="monotone" dataKey="daily" stroke="#8884d8" name="Daily Revenue" />
                            <Line type="monotone" dataKey="monthly" stroke="#82ca9d" name="Monthly Revenue" />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Pending Payments (Half Payments)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Patient Name</TableHead>
                              <TableHead>Paid Amount</TableHead>
                              <TableHead>Remaining</TableHead>
                              <TableHead>Due Date</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {halfPaymentData.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell>{payment.patient}</TableCell>
                                <TableCell>{payment.amount}</TableCell>
                                <TableCell className="text-destructive font-medium">{payment.remaining}</TableCell>
                                <TableCell>{payment.dueDate}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {reportsView === "insurance" && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold">Insurance Claims Summary</h2>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Claims Status Distribution</CardTitle>
                        <CardDescription>Overview of insurance claims by status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={insuranceClaimsData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                            >
                              {insuranceClaimsData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                          {insuranceClaimsData.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.fill }}></div>
                              <span className="text-sm">{item.name}: {item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

            <TabsContent value="insurance" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Insurance Management</h2>
                <p className="text-muted-foreground mb-8">Manage insurance providers and oversee claims</p>
              </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 cursor-pointer">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-gradient-primary">
                        <Plus className="w-6 h-6 text-primary-foreground" />
                      </div>
                      Add/Update Insurance Providers
                    </CardTitle>
                    <CardDescription>Manage insurance providers in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105">
                      Manage Providers
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 cursor-pointer">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-gradient-secondary">
                        <Eye className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      Oversee All Claims
                    </CardTitle>
                    <CardDescription>Monitor claims handled by staff</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full" variant="outline">
                      View All Claims
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Security & Settings</h2>
                <p className="text-muted-foreground mb-8">System backup and configuration management</p>
              </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 gap-6'}`}>
                <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-warning/5 to-accent/5 border-warning/20 cursor-pointer">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-warning">
                        <Database className="w-6 h-6 text-warning-foreground" />
                      </div>
                      Backup
                    </CardTitle>
                    <CardDescription>System backup and restore options</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>Last Backup</span>
                        <Badge variant="secondary">2 hours ago</Badge>
                      </div>
                      <Button className="w-full bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105">
                        Create Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-muted/5 to-accent/5 border-muted/20 cursor-pointer">
                  <CardHeader className="pb-6">
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-3 rounded-full bg-muted">
                        <Settings className="w-6 h-6 text-muted-foreground" />
                      </div>
                      Configuration
                    </CardTitle>
                    <CardDescription>System configuration and settings</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span>System Status</span>
                        <Badge variant="default">Online</Badge>
                      </div>
                      <Button className="w-full" variant="outline">
                        Configure System
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

          </Tabs>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 shadow-lg">
          <div className="grid grid-cols-3 gap-1 p-2">
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                activeTab === 'reports' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs font-medium">Reports</span>
            </button>
            <button
              onClick={() => setActiveTab('insurance')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                activeTab === 'insurance' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-medium">Insurance</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                activeTab === 'security' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="text-xs font-medium">Security</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopManagerDashboard;