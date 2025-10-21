// components/modals/MedicalHistoryModal.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, 
  Calendar, 
  Activity, 
  Stethoscope, 
  Pill, 
  Thermometer, 
  HeartPulse,
  X,
  Download,
  Edit
} from 'lucide-react';

interface MedicalRecord {
  id: number;
  date: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  notes: string;
  doctor: string;
}

interface MedicalHistoryModalProps {
  patient: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MedicalHistoryModal = ({ patient, open, onOpenChange }: MedicalHistoryModalProps) => {
  const [activeTab, setActiveTab] = useState('visits');
  
  // Sample medical records data
  const medicalRecords: MedicalRecord[] = [
    {
      id: 1,
      date: '2025-10-15',
      diagnosis: 'Hypertension',
      treatment: 'Lifestyle modification, monitoring',
      medications: ['Amlodipine 5mg', 'Lisinopril 10mg'],
      notes: 'Patient reports improved BP readings. Continue current regimen.',
      doctor: 'Dr. John Smith'
    },
    {
      id: 2,
      date: '2025-09-20',
      diagnosis: 'Routine Checkup',
      treatment: 'Annual physical',
      medications: [],
      notes: 'All vitals normal. No new concerns.',
      doctor: 'Dr. Sarah Johnson'
    },
    {
      id: 3,
      date: '2025-08-10',
      diagnosis: 'Upper Respiratory Infection',
      treatment: 'Antibiotics prescribed',
      medications: ['Amoxicillin 500mg'],
      notes: 'Symptoms resolved after 7 days.',
      doctor: 'Dr. Michael Brown'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary/80">
              <FileText className="w-6 h-6 text-primary-foreground" />
            </div>
            Medical History - {patient?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-border/50 mb-6">
            <div className="flex space-x-1 bg-muted/40 rounded-lg p-1 mx-2">
              {[
                { value: 'visits', label: 'Visit History', icon: Calendar },
                { value: 'diagnoses', label: 'Diagnoses', icon: Activity },
                { value: 'medications', label: 'Medications', icon: Pill },
                { value: 'notes', label: 'Clinical Notes', icon: Stethoscope }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.value}
                    onClick={() => setActiveTab(tab.value)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.value
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <ScrollArea className="flex-1">
            <Card className="bg-transparent border-0 shadow-none">
              <CardContent className="p-0 space-y-6">
                {activeTab === 'visits' && (
                  <div className="space-y-4">
                    {medicalRecords.map((record) => (
                      <Card key={record.id} className="hover:shadow-md transition-shadow duration-300 border-border/50">
                        <CardHeader className="pb-4">
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="text-lg font-semibold">{record.diagnosis}</span>
                                <Badge variant="secondary" className="text-xs">
                                  {record.date}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">Doctor: {record.doctor}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="h-8">
                                <Download className="w-3 h-3 mr-1" />
                                PDF
                              </Button>
                              <Button size="sm" variant="ghost" className="h-8">
                                <Edit className="w-3 h-3 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h5 className="font-medium mb-2 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-muted-foreground" />
                                Treatment
                              </h5>
                              <p className="text-sm text-muted-foreground">{record.treatment}</p>
                            </div>
                            <div>
                              <h5 className="font-medium mb-2 flex items-center gap-2">
                                <Pill className="w-4 h-4 text-muted-foreground" />
                                Medications
                              </h5>
                              <div className="space-y-1">
                                {record.medications.length > 0 ? (
                                  record.medications.map((med, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {med}
                                    </Badge>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">None</p>
                                )}
                              </div>
                            </div>
                          </div>
                          {record.notes && (
                            <div>
                              <h5 className="font-medium mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-muted-foreground" />
                                Notes
                              </h5>
                              <div className="p-3 bg-muted/20 rounded-lg">
                                <p className="text-sm whitespace-pre-wrap">{record.notes}</p>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {activeTab === 'diagnoses' && (
                  <div className="space-y-4">
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5" />
                          Diagnosis Summary
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {medicalRecords.map((record) => (
                            <div key={record.id} className="flex justify-between items-center p-3 bg-muted/20 rounded-lg">
                              <span className="font-medium">{record.diagnosis}</span>
                              <Badge variant="outline" className="text-xs">{record.date}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'medications' && (
                  <div className="space-y-4">
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Pill className="w-5 h-5" />
                          Medication History
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {medicalRecords.map((record) => (
                            record.medications.length > 0 && (
                              <div key={record.id} className="p-4 border rounded-lg bg-muted/10">
                                <div className="flex justify-between items-start mb-3">
                                  <h5 className="font-medium">{record.diagnosis}</h5>
                                  <Badge variant="secondary">{record.date}</Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                  {record.medications.map((med, idx) => (
                                    <Badge key={idx} variant="secondary" className="justify-start">
                                      {med}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    <Card className="border-border/50">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Stethoscope className="w-5 h-5" />
                          Clinical Notes
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {medicalRecords.map((record) => (
                            record.notes && (
                              <div key={record.id} className="p-4 bg-gradient-to-r from-muted/10 to-background rounded-lg border">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h5 className="font-medium">{record.diagnosis}</h5>
                                    <p className="text-sm text-muted-foreground">{record.date} • {record.doctor}</p>
                                  </div>
                                </div>
                                <p className="text-sm whitespace-pre-wrap">{record.notes}</p>
                              </div>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CardContent>
            </Card>
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
            Export All Records
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MedicalHistoryModal;