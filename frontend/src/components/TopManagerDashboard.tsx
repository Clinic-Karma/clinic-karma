import { useEffect, useState } from "react";
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  // Dynamic data from backend
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [insuranceChart, setInsuranceChart] = useState<any[]>([]);
  const [totalClaims, setTotalClaims] = useState<number>(0);

  const [patientBillsData, setPatientBillsData] = useState<any[]>([]);
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);

  // State for Add Provider form
  const [isAddProviderModalOpen, setIsAddProviderModalOpen] = useState(false);
  const [providerFormData, setProviderFormData] = useState({
    providerName: "",
    coveragePercentage: ""
  });
  const [isSubmittingProvider, setIsSubmittingProvider] = useState(false);

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
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/bills`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/appointments`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/revenue`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/pending-payments`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/topmanagers/dashboard/insurance-summary`, { withCredentials: true }),
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

  // Handle form input changes
  const handleProviderFormChange = (field: string, value: string) => {
    setProviderFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle form submission
  const handleAddProvider = async () => {
    if (!providerFormData.providerName || !providerFormData.coveragePercentage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const coverage = parseFloat(providerFormData.coveragePercentage);
    if (isNaN(coverage) || coverage < 0 || coverage > 100) {
      toast({
        title: "Invalid Coverage Percentage",
        description: "Coverage percentage must be a number between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingProvider(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/appointments/add-insurance-provider`, {
        providerName: providerFormData.providerName,
        coveragePercentage: coverage
      }, {
        withCredentials: true
      });

      if (response.data.success) {
        toast({
          title: "Provider Added Successfully",
          description: `${providerFormData.providerName} has been added with ${coverage}% coverage.`,
        });

        // Reset form and close modal
        setProviderFormData({
          providerName: "",
          coveragePercentage: ""
        });
        setIsAddProviderModalOpen(false);
      } else {
        throw new Error(response.data.message || 'Failed to add provider');
      }
    } catch (error: any) {
      console.error('Error adding provider:', error);
      
      let errorMessage = 'Failed to add insurance provider';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmittingProvider(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-gray-800/95 p-4 shadow-2xl rounded-xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
          <p className="font-bold text-lg text-gray-800 dark:text-gray-200 mb-3">{label}</p>
          <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {entry.dataKey === 'daily' ? 'Daily Revenue' : 'Monthly Revenue'}:
                  </span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    ${entry.value?.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
            <TabsContent value="revenue" className="space-y-8">
              {/* Enhanced Header Section */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl"></div>
                <div className="relative bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-8 shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        Revenue & Billing Analytics
                      </h2>
                      <p className="text-lg text-muted-foreground">
                        Comprehensive financial insights and payment tracking
                      </p>
                    </div>
                    <div className="hidden md:flex items-center space-x-4">
                      <div className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                        <TrendingUp className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Metrics Summary Cards */}
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-1 md:grid-cols-3 gap-6'}`}>
                <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20 border-emerald-200 dark:border-emerald-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Revenue</p>
                        <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                          ${revenueData.reduce((sum, item) => sum + (item.monthly || 0), 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">This month</p>
                      </div>
                      <div className="p-3 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                        <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Pending Payments</p>
                        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                          {halfPaymentData.length}
                        </p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Outstanding</p>
                      </div>
                      <div className="p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                        <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

              </div>

              {/* Enhanced Income Trends Chart */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-gradient-primary rounded-lg">
                          <TrendingUp className="w-5 h-5 text-primary-foreground" />
                        </div>
                        Income Trends
                      </CardTitle>
                      <CardDescription className="text-base">Daily and monthly revenue overview with growth indicators</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
                        <span className="text-sm font-medium">Daily</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"></div>
                        <span className="text-sm font-medium">Monthly</span>
                      </div>
                    </div>
                  </div>
                      </CardHeader>
                <CardContent className="p-6">
                  <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <defs>
                          <linearGradient id="dailyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="monthlyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#6b7280"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `$${value.toLocaleString()}`}
                        />
                        <Tooltip 
                          content={<CustomTooltip />}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="daily" 
                          stroke="#3b82f6" 
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2 }}
                          name="Daily Revenue"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="monthly" 
                          stroke="#10b981" 
                          strokeWidth={3}
                          dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                          activeDot={{ r: 8, stroke: '#10b981', strokeWidth: 2 }}
                          name="Monthly Revenue"
                        />
                          </LineChart>
                        </ResponsiveContainer>
                  </div>
                      </CardContent>
                    </Card>

              {/* Enhanced Pending Payments Table */}
              <Card className="group hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm border border-border/50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-2xl font-bold flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                          <CreditCard className="w-5 h-5 text-white" />
                        </div>
                        Pending Payments
                      </CardTitle>
                      <CardDescription className="text-base">Half payments requiring follow-up and collection</CardDescription>
                    </div>
                    <Badge variant="destructive" className="text-sm font-medium px-3 py-1">
                      {halfPaymentData.length} Outstanding
                    </Badge>
                  </div>
                      </CardHeader>
                <CardContent className="p-6">
                  <div className="rounded-xl border border-border/50 overflow-hidden">
                        <Table>
                      <TableHeader className="bg-gradient-to-r from-muted/50 to-muted/30">
                        <TableRow className="hover:bg-transparent">
                          <TableHead className="font-semibold text-foreground">Patient Name</TableHead>
                          <TableHead className="font-semibold text-foreground">Paid Amount</TableHead>
                          <TableHead className="font-semibold text-foreground">Remaining</TableHead>
                          <TableHead className="font-semibold text-foreground">Due Date</TableHead>
                          <TableHead className="font-semibold text-foreground">Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                        {halfPaymentData.map((payment, index) => (
                          <TableRow 
                            key={payment.id} 
                            className="group/row hover:bg-gradient-to-r hover:from-muted/30 hover:to-muted/10 transition-all duration-300"
                          >
                            <TableCell className="font-medium group-hover/row:text-primary transition-colors">
                              {payment.patient}
                            </TableCell>
                            <TableCell className="text-emerald-600 dark:text-emerald-400 font-semibold">
                              ${payment.amount}
                            </TableCell>
                            <TableCell className="text-destructive font-bold text-lg">
                              ${payment.remaining}
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {payment.dueDate}
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="destructive" 
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0"
                              >
                                Overdue
                              </Badge>
                            </TableCell>
                              </TableRow>
                            ))}
                        {halfPaymentData.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                              <div className="flex flex-col items-center space-y-2">
                                <CreditCard className="w-8 h-8 opacity-50" />
                                <p>No pending payments found</p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                          </TableBody>
                        </Table>
                  </div>
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
                      Add Insurance Providers
                    </CardTitle>
                    <CardDescription>Manage insurance providers in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog open={isAddProviderModalOpen} onOpenChange={setIsAddProviderModalOpen}>
                      <DialogTrigger asChild>
                        <Button className="w-full bg-gradient-hero hover:opacity-90 transition-all duration-300 shadow-button transform hover:scale-105">
                          Add a provider
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Add Insurance Provider</DialogTitle>
                          <DialogDescription>
                            Add a new insurance provider to the system with their coverage percentage.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="providerName" className="text-right">
                              Provider Name
                            </Label>
                            <Input
                              id="providerName"
                              value={providerFormData.providerName}
                              onChange={(e) => handleProviderFormChange('providerName', e.target.value)}
                              className="col-span-3"
                              placeholder="e.g., Blue Cross Blue Shield"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="coveragePercentage" className="text-right">
                              Coverage %
                            </Label>
                            <Input
                              id="coveragePercentage"
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={providerFormData.coveragePercentage}
                              onChange={(e) => handleProviderFormChange('coveragePercentage', e.target.value)}
                              className="col-span-3"
                              placeholder="e.g., 80"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="outline" 
                            onClick={() => setIsAddProviderModalOpen(false)}
                            disabled={isSubmittingProvider}
                          >
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleAddProvider}
                            disabled={isSubmittingProvider}
                            className="bg-gradient-hero hover:opacity-90"
                          >
                            {isSubmittingProvider ? "Adding..." : "Add Provider"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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