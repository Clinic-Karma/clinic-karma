// components/modals/LabReportsModal.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BarChart3, 
  FileText, 
  Calendar, 
  Download, 
  Search, 
  AlertCircle, 
  CheckCircle,
  X,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LabReport {
  id: number;
  date: string;
  type: string;
  status: 'pending' | 'completed' | 'normal' | 'abnormal';
  results: { [key: string]: any };
  referenceRanges: { [key: string]: { low: number; high: number } };
  notes: string;
  fileUrl?: string;
}

interface LabReportsModalProps {
  patient: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LabReportsModal = ({ patient, open, onOpenChange }: LabReportsModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const labReports: LabReport[] = [
    {
      id: 1,
      date: '2025-10-18',
      type: 'Complete Blood Count (CBC)',
      status: 'completed',
      results: {
        'WBC': 7.2,
        'RBC': 4.8,
        'Hemoglobin': 14.2,
        'Platelets': 250
      },
      referenceRanges: {
        'WBC': { low: 4.5, high: 11.0 },
        'RBC': { low: 4.2, high: 5.9 },
        'Hemoglobin': { low: 13.5, high: 17.5 },
        'Platelets': { low: 150, high: 450 }
      },
      notes: 'All values within normal limits.',
      fileUrl: '/api/reports/cbc-2025-10-18.pdf'
    },
    {
      id: 2,
      date: '2025-09-25',
      type: 'Lipid Panel',
      status: 'completed',
      results: {
        'Total Cholesterol': 220,
        'HDL': 45,
        'LDL': 140,
        'Triglycerides': 180
      },
      referenceRanges: {
        'Total Cholesterol': { low: 0, high: 200 },
        'HDL': { low: 40, high: 100 },
        'LDL': { low: 0, high: 130 },
        'Triglycerides': { low: 0, high: 150 }
      },
      notes: 'Elevated cholesterol levels. Recommend dietary changes.',
      fileUrl: '/api/reports/lipid-2025-09-25.pdf'
    },
    {
      id: 3,
      date: '2025-10-15',
      type: 'Liver Function Tests',
      status: 'pending',
      results: {},
      referenceRanges: {},
      notes: 'Results pending from lab.',
      fileUrl: undefined
    }
  ];

  const filteredReports = labReports.filter(report =>
    report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.date.includes(searchTerm) ||
    report.status.includes(searchTerm.toLowerCase())
  );

    const getStatusVariant = (status: LabReport['status']) => {
    switch (status) {
        case 'completed': 
        case 'normal': 
        return 'default'; // Changed from 'success'
        case 'abnormal': 
        return 'destructive';
        case 'pending': 
        return 'secondary';
        default: 
        return 'default'; // Changed from 'secondary'
    }
    };

  const getStatusIcon = (status: LabReport['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'normal': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'abnormal': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'pending': return <Activity className="w-4 h-4 text-muted-foreground animate-spin" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 rounded-xl bg-gradient-to-br from-secondary to-secondary/80">
              <BarChart3 className="w-6 h-6 text-secondary-foreground" />
            </div>
            Lab Reports - {patient?.name}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search and Tabs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6 p-1 bg-muted/20 rounded-lg">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports by type, date, or status..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-0">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="abnormal">Abnormal</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Reports Grid */}
          <ScrollArea className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-lg">{report.type}</h4>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            <span>{report.status}</span>
                          </span>
                          <span>{report.date}</span>
                        </div>
                      </div>
                      <Badge variant={getStatusVariant(report.status)} className="flex items-center gap-1">
                        {getStatusIcon(report.status)}
                        {report.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {report.status === 'pending' ? (
                      <div className="flex items-center justify-center py-8 text-muted-foreground">
                        <Activity className="w-8 h-8 animate-spin mr-3" />
                        <span>Results pending from laboratory</span>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3">
                          {Object.entries(report.results).map(([key, value]) => {
                            const range = report.referenceRanges[key as string];
                            const isAbnormal = range && (value < range.low || value > range.high);
                            return (
                              <div key={key} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                                <span className="font-medium">{key}:</span>
                                <div className="text-right">
                                  <div className={`font-semibold ${isAbnormal ? 'text-destructive' : ''}`}>
                                    {typeof value === 'number' ? `${value}` : value}
                                  </div>
                                  {range && (
                                    <div className="text-xs text-muted-foreground">
                                      {range.low}-{range.high}
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {report.notes && (
                          <div className="p-3 bg-gradient-to-r from-warning/10 to-warning/5 rounded-lg">
                            <p className="text-sm text-muted-foreground">{report.notes}</p>
                          </div>
                        )}
                        {report.fileUrl && (
                          <Button 
                            variant="outline" 
                            className="w-full justify-center"
                            asChild
                          >
                            <a href={report.fileUrl} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4 mr-2" />
                              Download Report PDF
                            </a>
                          </Button>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
            {filteredReports.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <BarChart3 className="w-12 h-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No lab reports found</h3>
                <p className="text-sm">Try adjusting your search criteria</p>
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-border/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Close
          </Button>
          <Button className="bg-gradient-primary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export All Reports
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LabReportsModal;