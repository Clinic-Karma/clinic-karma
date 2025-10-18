import { useEffect, useState } from "react";
import axios from 'axios';
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
  LogOut
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite

const TopManagerDashboard = () => {
  const [activeTab, setActiveTab] = useState("revenue");
  const isMobile = useIsMobile();

  // Dynamic data from backend
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [insuranceChart, setInsuranceChart] = useState<any[]>([]);
  const [totalClaims, setTotalClaims] = useState<number>(0);

  const [patientBillsData, setPatientBillsData] = useState<any[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);

  const [halfPaymentData, setHalfPaymentData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          billsRes,
          apptsRes,
          revenueRes,
          pendingRes,
          insuranceSummaryRes,
        ] = await Promise.all([
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/bills`),
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/appointments`),
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/revenue`),
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/pending-payments`),
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/insurance-summary`),
        ]);

        const bills = Array.isArray(billsRes.data?.bills) ? billsRes.data.bills : [];
        setPatientBillsData(bills.map((b: any) => ({
          id: b.bill_id,
          name: b.patient_name,
          amount: b.total_amount,
          status: 'Paid',
          date: b.appointment_date,
        })));

        const appts = Array.isArray(apptsRes.data?.appointments) ? apptsRes.data.appointments : [];
        setAppointmentsData(appts.map((a: any) => ({
          id: a.Appointment_ID || a.id,
          patient: a.patient_name || a.patient || 'Patient',
          doctor: a.doctor_name || a.doctor || 'Doctor',
          date: a.Appointment_Date || a.appointment_date,
          time: a.Time_Slot || a.time_slot || '',
          status: a.Status || a.status || 'Scheduled',
        })));

        const rev = Array.isArray(revenueRes.data?.data) ? revenueRes.data.data : [];
        setRevenueData(rev.map((r: any) => ({
          name: r.month_short,
          daily: Number(r.monthly_total) || 0,
          monthly: Number(r.monthly_total) || 0,
        })));

        const pending = Array.isArray(pendingRes.data?.data) ? pendingRes.data.data : [];
        setHalfPaymentData(pending.map((p: any, idx: number) => ({
          id: idx + 1,
          patient: p.patient,
          amount: p.amount,
          remaining: p.remaining,
          dueDate: p.due_date,
        })));

        const summary = insuranceSummaryRes.data;
        if (summary?.success) {
          setTotalClaims(Number(summary.totalClaims) || 0);
          const chart = Array.isArray(summary.chart) ? summary.chart : [];
          // Apply fills to match existing colors
          const fillMap: any = { Approved: '#10b981', Pending: '#f59e0b', Rejected: '#ef4444' };
          setInsuranceChart(chart.map((c: any) => ({ ...c, fill: fillMap[c.name] || '#8884d8' })));
        } else {
          setTotalClaims(0);
          setInsuranceChart([]);
        }
      } catch (e) {
        console.error('Failed to load reports data', e);
      }
    };
    fetchData();
  }, []);

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
                  onClick={() => setActiveTab('revenue')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'revenue' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'revenue' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Revenue & Billing</span>
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
                
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsContent value="revenue" className="space-y-6">
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
          </TabsContent>

            <TabsContent value="insurance" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Insurance Management</h2>
                <p className="text-muted-foreground mb-8">Manage insurance providers and oversee claims</p>
                  </div>
              
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-3 gap-6'}`}>
                <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20">
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
                    <div className="text-3xl font-bold text-primary mb-2">{totalClaims}</div>
                    <p className="text-sm text-muted-foreground">Total claims</p>
                  </CardContent>
                </Card>
              </div>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Claims Status Distribution</CardTitle>
                        <CardDescription>Overview of insurance claims by status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                        data={insuranceChart}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              dataKey="value"
                            >
                        {insuranceChart.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <Tooltip content={<PieTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="flex justify-center gap-6 mt-4">
                    {insuranceChart.map((item) => (
                            <div key={item.name} className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded" style={{ backgroundColor: item.fill }}></div>
                              <span className="text-sm">{item.name}: {item.value}%</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

              
              
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

                
              </div>
            </TabsContent>

            

          </Tabs>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 shadow-lg">
          <div className="grid grid-cols-2 gap-1 p-2">
            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
                activeTab === 'revenue' 
                  ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                  : 'hover:bg-muted/50'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              <span className="text-xs font-medium">Revenue</span>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TopManagerDashboard;