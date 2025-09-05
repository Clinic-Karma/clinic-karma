import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { BarChart3, Shield, CreditCard, Users, Calendar, DollarSign, TrendingUp, FileText, Plus, Eye, Settings, Database, ChevronDown } from "lucide-react";

const TopManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("reports");
  const [reportsView, setReportsView] = useState("total-patients");
  const [timeFilter, setTimeFilter] = useState("monthly");

  // Dummy data for charts
  const revenueData = [
    { name: 'Jan', income: 12000, target: 15000 },
    { name: 'Feb', income: 19000, target: 15000 },
    { name: 'Mar', income: 15000, target: 15000 },
    { name: 'Apr', income: 25000, target: 20000 },
    { name: 'May', income: 22000, target: 20000 },
    { name: 'Jun', income: 30000, target: 25000 },
  ];

  const dailyRevenueData = [
    { name: 'Mon', income: 800 },
    { name: 'Tue', income: 1200 },
    { name: 'Wed', income: 900 },
    { name: 'Thu', income: 1500 },
    { name: 'Fri', income: 2000 },
    { name: 'Sat', income: 1800 },
    { name: 'Sun', income: 1000 },
  ];

  const insuranceClaimsData = [
    { name: 'Approved', value: 65, color: '#10b981' },
    { name: 'Pending', value: 25, color: '#f59e0b' },
    { name: 'Rejected', value: 10, color: '#ef4444' },
  ];

  const patientsData = [
    { id: 1, name: "John Doe", nic: "199012345678", appointment: "2024-01-15", bill: "$250", status: "Paid" },
    { id: 2, name: "Jane Smith", nic: "198567891234", appointment: "2024-01-16", bill: "$180", status: "Pending" },
    { id: 3, name: "Mike Johnson", nic: "199234567890", appointment: "2024-01-17", bill: "$320", status: "Paid" },
    { id: 4, name: "Sarah Wilson", nic: "197845612378", appointment: "2024-01-18", bill: "$150", status: "Half Paid" },
    { id: 5, name: "David Brown", nic: "199556789123", appointment: "2024-01-19", bill: "$280", status: "Pending" },
  ];

  const halfPaymentsData = [
    { id: 1, patient: "Sarah Wilson", amount: "$75", remaining: "$75", date: "2024-01-18" },
    { id: 2, patient: "Robert Davis", amount: "$120", remaining: "$80", date: "2024-01-20" },
    { id: 3, patient: "Emily Chen", amount: "$90", remaining: "$90", date: "2024-01-22" },
  ];

  const insuranceProviders = [
    { name: "Blue Cross Blue Shield", status: "Active", claims: 245 },
    { name: "Aetna", status: "Active", claims: 189 },
    { name: "Cigna", status: "Active", claims: 156 },
    { name: "UnitedHealthcare", status: "Active", claims: 201 },
  ];

  const renderReportsContent = () => {
    switch (reportsView) {
      case "total-patients":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Patient Bills and Appointments</h4>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>NIC</TableHead>
                      <TableHead>Appointment</TableHead>
                      <TableHead>Bill Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientsData.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.name}</TableCell>
                        <TableCell>{patient.nic}</TableCell>
                        <TableCell>{patient.appointment}</TableCell>
                        <TableCell>{patient.bill}</TableCell>
                        <TableCell>
                          <Badge variant={
                            patient.status === "Paid" ? "default" : 
                            patient.status === "Half Paid" ? "secondary" : "destructive"
                          }>
                            {patient.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      
      case "revenue-billing":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-semibold">Revenue and Billing Reports</h4>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Income Trends</CardTitle>
                <CardDescription>Revenue performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timeFilter === "daily" ? dailyRevenueData : revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                    {timeFilter === "monthly" && <Line type="monotone" dataKey="target" stroke="#6b7280" strokeWidth={2} strokeDasharray="5 5" />}
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Half Payments Pending</CardTitle>
                <CardDescription>Payments requiring completion</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient Name</TableHead>
                      <TableHead>Amount Paid</TableHead>
                      <TableHead>Remaining</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {halfPaymentsData.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">{payment.patient}</TableCell>
                        <TableCell>{payment.amount}</TableCell>
                        <TableCell className="text-destructive font-medium">{payment.remaining}</TableCell>
                        <TableCell>{payment.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        );
      
      case "insurance-claims":
        return (
          <div className="space-y-6">
            <h4 className="text-lg font-semibold">Insurance Claims Summary</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Claims Distribution</CardTitle>
                  <CardDescription>Current claims status overview</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={insuranceClaimsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {insuranceClaimsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Claims by Provider</CardTitle>
                  <CardDescription>Monthly claims processed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {insuranceProviders.map((provider, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{provider.name}</p>
                        <p className="text-sm text-muted-foreground">{provider.claims} claims</p>
                      </div>
                      <Badge variant="default">{provider.status}</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground">Top Manager Dashboard</h2>
        <p className="text-muted-foreground mt-2">System-wide oversight and management</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            System Reports
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
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant={reportsView === "total-patients" ? "default" : "outline"}
                onClick={() => setReportsView("total-patients")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <Users className="w-6 h-6 mb-2" />
                Total Patients
              </Button>
              <Button 
                variant={reportsView === "revenue-billing" ? "default" : "outline"}
                onClick={() => setReportsView("revenue-billing")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <DollarSign className="w-6 h-6 mb-2" />
                Revenue & Billing
              </Button>
              <Button 
                variant={reportsView === "insurance-claims" ? "default" : "outline"}
                onClick={() => setReportsView("insurance-claims")}
                className="h-20 flex flex-col items-center justify-center"
              >
                <FileText className="w-6 h-6 mb-2" />
                Insurance Claims
              </Button>
            </div>
            
            {renderReportsContent()}
          </div>
        </TabsContent>

        <TabsContent value="insurance" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <Plus className="w-6 h-6 mb-2" />
                    Add/Update Insurance Providers
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Insurance Provider</DialogTitle>
                    <DialogDescription>Add a new insurance provider to the system</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="provider-name">Provider Name</Label>
                      <Input id="provider-name" placeholder="Enter provider name" />
                    </div>
                    <div>
                      <Label htmlFor="contact">Contact Information</Label>
                      <Input id="contact" placeholder="Enter contact details" />
                    </div>
                    <div>
                      <Label htmlFor="coverage">Coverage Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select coverage type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full">Full Coverage</SelectItem>
                          <SelectItem value="partial">Partial Coverage</SelectItem>
                          <SelectItem value="emergency">Emergency Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button className="w-full">Add Provider</Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                <Eye className="w-6 h-6 mb-2" />
                Oversee All Claims
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Current Insurance Providers</CardTitle>
                <CardDescription>Manage existing insurance partnerships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {insuranceProviders.map((provider, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">{provider.name}</h4>
                          <Badge variant="default">{provider.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{provider.claims} claims this month</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">View Claims</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="mt-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <Database className="w-6 h-6 mb-2" />
                    Backup Management
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>System Backup</DialogTitle>
                    <DialogDescription>Configure and manage system backups</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Last Backup</span>
                      <Badge variant="secondary">2 hours ago</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Backup Frequency</span>
                      <Badge variant="outline">Every 6 hours</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Storage Used</span>
                      <Badge variant="secondary">2.3 GB</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1">Start Backup</Button>
                      <Button variant="outline" className="flex-1">Schedule</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                    <Settings className="w-6 h-6 mb-2" />
                    System Configuration
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>System Configuration</DialogTitle>
                    <DialogDescription>Configure system-wide settings</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                      <Input id="session-timeout" type="number" defaultValue="30" />
                    </div>
                    <div>
                      <Label htmlFor="max-users">Maximum Concurrent Users</Label>
                      <Input id="max-users" type="number" defaultValue="100" />
                    </div>
                    <div>
                      <Label htmlFor="data-retention">Data Retention (years)</Label>
                      <Input id="data-retention" type="number" defaultValue="7" />
                    </div>
                    <Button className="w-full">Save Configuration</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Status</CardTitle>
                  <CardDescription>Current system security overview</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Firewall Status</span>
                    <Badge variant="default">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL Certificate</span>
                    <Badge variant="default">Valid</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Failed Login Attempts</span>
                    <Badge variant="secondary">3 today</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Last Security Scan</span>
                    <Badge variant="outline">1 day ago</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                  <CardDescription>Performance and status indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>System Uptime</span>
                    <Badge variant="default">99.9%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>CPU Usage</span>
                    <Badge variant="secondary">45%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Memory Usage</span>
                    <Badge variant="secondary">62%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Disk Space</span>
                    <Badge variant="outline">78% used</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TopManagerDashboard;