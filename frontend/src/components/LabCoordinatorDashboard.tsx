import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, FileText, FlaskConical, Activity, FileCheck, Home, Bell, LogOut, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import apiClient from "@/utils/axiosConfig";

const LabCoordinatorDashboard = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadFormData, setUploadFormData] = useState({
    patientUsername: '',
    appointmentId: '',
    treatmentName: '',
    reportFile: null
  });
  const [labReports, setLabReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();


  const treatmentCatalogue = [
    "Blood Test - Complete Blood Count",
    "Blood Test - Lipid Profile", 
    "Urine Test - Routine",
    "X-Ray - Chest",
    "X-Ray - Limb",
    "MRI - Brain",
    "CT Scan - Abdomen",
    "ECG",
    "Ultrasound"
  ];
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite

  // Function to fetch lab reports
  const fetchLabReports = async () => {
    setIsLoadingReports(true);
    try {
      const response = await apiClient.get('/appointments/lab-reports');
      
      if (response.status === 200) {
        setLabReports(response.data.data || []);
      } else {
        throw new Error(response.data.message || 'Failed to fetch lab reports');
      }
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch lab reports',
        variant: "destructive",
      });
      setLabReports([]);
    } finally {
      setIsLoadingReports(false);
    }
  };

  // Load lab reports when component mounts or when reports tab is accessed
  React.useEffect(() => {
    if (activeTab === 'reports') {
      fetchLabReports();
    }
  }, [activeTab]);


  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!uploadFormData.patientUsername || !uploadFormData.appointmentId || !uploadFormData.treatmentName || !uploadFormData.reportFile) {
      toast({
        title: "Error",
        description: "Please fill in all fields and select a file",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('appointmentId', uploadFormData.appointmentId);
      formData.append('patientUsername', uploadFormData.patientUsername);
      formData.append('treatmentName', uploadFormData.treatmentName);
      formData.append('reportFile', uploadFormData.reportFile);

      const response = await apiClient.post('/appointments/upload-lab-report', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: "Lab report uploaded successfully!",
        });
        
        // Reset form
        setUploadFormData({
          patientUsername: '',
          appointmentId: '',
          treatmentName: '',
          reportFile: null
        });
        setIsUploadDialogOpen(false);
        
        // Refresh lab reports if we're on the reports tab
        if (activeTab === 'reports') {
          fetchLabReports();
        }
      } else {
        throw new Error(response.data.message || 'Failed to upload lab report');
      }
    } catch (error: any) {
      console.error('Error uploading lab report:', error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || error.message || 'Failed to upload lab report',
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-muted/30 to-background ${isMobile ? 'pb-20' : ''}`}>
      {/* Header */}
      <header className="bg-gradient-hero text-primary-foreground shadow-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10"></div>
        <div className={`relative container mx-auto ${isMobile ? 'px-4 py-4' : 'px-8 py-8'}`}>
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Lab Coordinator Dashboard</h1>
              <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>Manage laboratory reports and patient test results</p>
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
                  onClick={() => setActiveTab('upload')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'upload' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'upload' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Upload Reports</span>
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
                    <FlaskConical className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Lab Reports</span>
                </button>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

            {/* Upload Tab */}
            <TabsContent value="upload" className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Upload Lab Reports</h2>
                <p className="text-muted-foreground mb-8">Upload and manage laboratory test reports for patients</p>
              </div>
              
              <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 rounded-full bg-gradient-primary">
                      <Upload className="w-6 h-6 text-primary-foreground" />
                    </div>
                    Lab Report Upload
                  </CardTitle>
                  <p className="text-muted-foreground ml-12">Select patient and upload their lab test results</p>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                      <DialogTrigger asChild>
                        <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 cursor-pointer">
                          <CardContent className="p-8 text-center">
                            <div className="p-4 rounded-full bg-gradient-primary mx-auto mb-4 w-fit">
                              <Upload className="w-10 h-10 text-primary-foreground" />
                            </div>
                            <h3 className="font-semibold text-xl mb-2">Upload Report</h3>
                            <p className="text-sm text-muted-foreground">Click to upload new lab reports</p>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Upload Lab Report</DialogTitle>
                    <DialogDescription>
                      Fill in the patient details and upload the lab report
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleUploadReport} className="space-y-4">
                    {/* Patient Username */}
                    <div className="space-y-2">
                      <Label htmlFor="patientUsername">Patient Username</Label>
                      <Input 
                        id="patientUsername" 
                        placeholder="Enter patient username" 
                        value={uploadFormData.patientUsername}
                        onChange={(e) => setUploadFormData({...uploadFormData, patientUsername: e.target.value})}
                        required 
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Appointment ID */}
                    <div className="space-y-2">
                      <Label htmlFor="appointmentId">Appointment ID</Label>
                      <Input 
                        id="appointmentId" 
                        placeholder="Enter appointment ID" 
                        value={uploadFormData.appointmentId}
                        onChange={(e) => setUploadFormData({...uploadFormData, appointmentId: e.target.value})}
                        required 
                        className="border-primary/20 focus:border-primary"
                      />
                    </div>

                    {/* Treatment Name - Dropdown from Catalogue */}
                    <div className="space-y-2">
                      <Label htmlFor="treatmentName">Treatment Name</Label>
                      <Select 
                        value={uploadFormData.treatmentName}
                        onValueChange={(value) => setUploadFormData({...uploadFormData, treatmentName: value})}
                        required
                      >
                        <SelectTrigger className="border-primary/20 focus:border-primary">
                          <SelectValue placeholder="Select treatment from catalogue" />
                        </SelectTrigger>
                        <SelectContent>
                          {treatmentCatalogue.map((treatment, index) => (
                            <SelectItem key={index} value={treatment}>
                              {treatment}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Report File Upload */}
                    <div className="space-y-2">
                      <Label htmlFor="reportFile">Report File Upload</Label>
                      <Input 
                        id="reportFile" 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" 
                        onChange={(e) => setUploadFormData({...uploadFormData, reportFile: e.target.files?.[0] || null})}
                        required 
                        className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsUploadDialogOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit">Upload Report</Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Lab Reports Tab */}
      <TabsContent value="reports" className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Lab Reports</h2>
          <p className="text-muted-foreground mb-8">View and manage all laboratory reports</p>
        </div>
        
        <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-gradient-primary">
                <FlaskConical className="w-5 h-5 text-primary-foreground" />
              </div>
              Recent Lab Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <div className="text-center py-12">
                <div className="p-6 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 mx-auto mb-6 w-fit">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
                <h3 className="text-xl font-semibold mb-3">Loading Reports...</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Please wait while we fetch the lab reports.</p>
              </div>
            ) : labReports.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-6 rounded-full bg-gradient-to-br from-muted/20 to-muted/10 mx-auto mb-6 w-fit">
                  <FileCheck className="w-16 h-16 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">No Reports Available</h3>
                <p className="text-muted-foreground max-w-md mx-auto">Lab reports will appear here once they are uploaded to the system.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground">
                    Showing {labReports.length} lab report{labReports.length !== 1 ? 's' : ''}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={fetchLabReports}
                    className="flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
                
                <div className="grid gap-4">
                  {labReports.map((report) => (
                    <div key={report.Appointment_ID} className="border border-border/50 rounded-xl p-6 space-y-4 bg-gradient-to-r from-background to-muted/10 hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-lg flex items-center gap-2">
                            <FlaskConical className="w-5 h-5 text-primary" />
                            {report.Treatment_name}
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">Patient:</span>
                              <p className="font-medium">{report.patient_name} ({report.patient_username})</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Appointment ID:</span>
                              <p className="font-medium">#{report.Appointment_ID}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Date:</span>
                              <p className="font-medium">{new Date(report.Appointment_Date).toLocaleDateString()}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">Catalogue ID:</span>
                              <p className="font-medium">#{report.Catalogue_ID}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          {report.Report_Links && (
                            <>
                              {report.Report_Links.startsWith('/uploads/') ? (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                      const directUrl = `http://localhost:5000${report.Report_Links}`;
                                      console.log('Opening file:', directUrl);
                                      window.open(directUrl, '_blank');
                                    }}
                                    className="flex items-center gap-2"
                                  >
                                    <FileText className="w-4 h-4" />
                                    View Report
                                  </Button>
                                </>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    disabled
                                    className="flex items-center gap-2 opacity-50"
                                  >
                                    <FileText className="w-4 h-4" />
                                    Report Not Available
                                  </Button>
                                  <p className="text-xs text-muted-foreground">
                                    This report was uploaded with an old system
                                  </p>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>


      </Tabs>
    </main>
  </div>

  {/* Mobile Bottom Navigation */}
  {isMobile && (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 shadow-lg">
      <div className="grid grid-cols-2 gap-1 p-2">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
            activeTab === 'upload' 
              ? 'bg-gradient-primary text-primary-foreground shadow-button' 
              : 'hover:bg-muted/50'
          }`}
        >
          <Upload className="w-5 h-5" />
          <span className="text-xs font-medium">Upload</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
            activeTab === 'reports' 
              ? 'bg-gradient-primary text-primary-foreground shadow-button' 
              : 'hover:bg-muted/50'
          }`}
        >
          <FlaskConical className="w-5 h-5" />
          <span className="text-xs font-medium">Reports</span>
        </button>
      </div>
    </div>
  )}
</div>
);
};

export default LabCoordinatorDashboard;