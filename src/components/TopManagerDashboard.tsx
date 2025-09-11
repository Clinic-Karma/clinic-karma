import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
  Eye
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

const TopManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [reportsView, setReportsView] = useState("");

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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Top Manager Dashboard</h1>
          <p className="text-muted-foreground mt-2">System-wide oversight and management</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              System Wide Reports
            </TabsTrigger>
            <TabsTrigger value="insurance" className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Insurance Management
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Security & Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="mt-6">
            {!reportsView ? (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">System Wide Reports</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setReportsView("patients")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-primary" />
                        Total Patients
                      </CardTitle>
                      <CardDescription>View patient bills and appointments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary mb-2">1,247</div>
                      <p className="text-sm text-muted-foreground">Active patients</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setReportsView("revenue")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Revenue & Billing
                      </CardTitle>
                      <CardDescription>Income trends and pending payments</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-primary mb-2">$124K</div>
                      <p className="text-sm text-muted-foreground">Monthly revenue</p>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setReportsView("insurance")}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
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

          <TabsContent value="insurance" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Insurance Management</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      Add/Update Insurance Providers
                    </CardTitle>
                    <CardDescription>Manage insurance providers in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      Manage Providers
                    </Button>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-primary" />
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
            </div>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Security & Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="w-5 h-5 text-primary" />
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
                      <Button className="w-full">
                        Create Backup
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      System Configuration
                    </CardTitle>
                    <CardDescription>Configure system-wide settings</CardDescription>
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TopManagerDashboard;