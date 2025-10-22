import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { Calendar as CalendarIcon, Users, UserPlus, Search, Stethoscope, FileText, DollarSign, Clock, User, Eye, Edit, CreditCard, CalendarDays, X, CheckCircle, Home, Bell, LogOut, Shield, Info, Receipt, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import html2pdf from 'html2pdf.js';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // For Vite


const ReceptionistDashboard = () => {
  const [activeTab, setActiveTab] = useState("appointments");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  // State for Book Appointment modal
  const [bookDate, setBookDate] = useState<Date>();
  const [bookSpecialization, setBookSpecialization] = useState("");
  const [bookPatientUsername, setBookPatientUsername] = useState("");
  const [bookDoctor, setBookDoctor] = useState("");
  const [bookTimeSlot, setBookTimeSlot] = useState("");
  const [bookBranch, setBookBranch] = useState("Colombo");
  const [specializationsData, setSpecializationsData] = useState<{ id: number; name: string }[]>([]);
  const [doctorsData, setDoctorsData] = useState<{ id: number; name: string }[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [pendingInsurances, setPendingInsurances] = useState<{ username: string; insuranceId: string; approved: boolean; policyNumber?: string; providerName?: string; coveragePercentage?: string; }[]>([]);
  
  // State for Insurance Claim submission
  const [claimBillId, setClaimBillId] = useState("");
  const [claimInsuranceId, setClaimInsuranceId] = useState("");
  const [availableInsurances, setAvailableInsurances] = useState<{ Insurance_ID: number; Provider_Name: string; Policy_Number: string; Coverage_Percentage: string; }[]>([]);
  const [isLoadingInsurances, setIsLoadingInsurances] = useState(false);
  
  // State for Add Patient Insurance
  const [insuranceProviders, setInsuranceProviders] = useState<{ Insurance_ID: number; Provider_Name: string; Coverage_Percentage: string; }[]>([]);
  const [addInsurancePatientUsername, setAddInsurancePatientUsername] = useState("");
  const [addInsuranceProviderId, setAddInsuranceProviderId] = useState("");
  const [addInsurancePolicyNumber, setAddInsurancePolicyNumber] = useState("");
  const selectedInsuranceProvider = insuranceProviders.find((p) => p.Insurance_ID.toString() === addInsuranceProviderId);
  
  // State for Billing
  const [billAppointmentId, setBillAppointmentId] = useState("");
  const [billDetails, setBillDetails] = useState<any>(null);
  const [userPaymentAmount, setUserPaymentAmount] = useState("");
  const [isGeneratingBill, setIsGeneratingBill] = useState(false);

  // State for Patient Registration
  const [patientFormData, setPatientFormData] = useState({
    username: "",
    password: "",
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    address: ""
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  
  // State for Cancel Appointment modal
  const [cancelAppointmentId, setCancelAppointmentId] = useState("");
  
  // State for Reschedule Appointment modal
  const [reschedulePatientUsername, setReschedulePatientUsername] = useState("");
  const [rescheduleDate, setRescheduleDate] = useState<Date>();
  const [rescheduleAppointmentId, setRescheduleAppointmentId] = useState("");
  const [rescheduleTimeSlot, setRescheduleTimeSlot] = useState("");

  // Load data from backend for booking
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/appointments/specializations`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load specializations');
        setSpecializationsData(Array.isArray(data.specializations) ? data.specializations : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // Load pending insurances
  useEffect(() => {
    (async () => {
      try {
        console.log('Fetching pending insurances...');
        const res = await fetch(`${API_BASE_URL}/appointments/pending-insurances`);
        const data = await res.json();
        console.log('Pending insurances response:', data);
        if (!res.ok) throw new Error(data.message || 'Failed to load pending insurances');
        const insurances = Array.isArray(data.insurances) ? data.insurances.map((item: any) => ({
          username: item.patient_username,
          insuranceId: item.insurance_id,
          approved: item.status === 'Approved',
          policyNumber: item.policy_number,
          providerName: item.provider_name,
          coveragePercentage: item.coverage_percentage
        })) : [];
        console.log('Processed insurances:', insurances);
        setPendingInsurances(insurances);
      } catch (err) {
        console.error('Error loading pending insurances:', err);
      }
    })();
  }, []);

  // Load insurance providers
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/appointments/insurance-providers`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load insurance providers');
        setInsuranceProviders(Array.isArray(data.data.insuranceProviders) ? data.data.insuranceProviders : []);
      } catch (err) {
        console.error('Error loading insurance providers:', err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setDoctorsData([]);
        setBookDoctor("");
        if (!bookSpecialization || !bookBranch) return;
        const selected = specializationsData.find(s => s.name === bookSpecialization);
        if (!selected) return;
        const res = await fetch(`${API_BASE_URL}/appointments/doctors/${encodeURIComponent(selected.id)}/${encodeURIComponent(bookBranch)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load doctors');
        setDoctorsData(Array.isArray(data.doctors) ? data.doctors : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [bookSpecialization, bookBranch, specializationsData]);

  useEffect(() => {
    (async () => {
      try {
        setAvailableSlots([]);
        setBookTimeSlot("");
        if (!bookDoctor || !bookDate) return;
        const selected = doctorsData.find(d => d.name === bookDoctor);
        if (!selected) return;
        const localDate = format(bookDate, 'yyyy-MM-dd');
        const res = await fetch(`${API_BASE_URL}/appointments/available-slots/${selected.id}/${localDate}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load time slots');
        setAvailableSlots(Array.isArray(data.availableSlots) ? data.availableSlots : []);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [bookDoctor, bookDate, doctorsData]);

  const timeSlots = [
    "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
  ];

  const branches = ["Colombo","Kandy", "Galle"];

  const sampleAppointments: Record<string, string[]> = {
    "john_doe": ["Appointment with Dr. Smith - March 15, 2024", "Appointment with Dr. Johnson - March 20, 2024"],
    "jane_smith": ["Appointment with Dr. Williams - March 18, 2024"],
    "bob_johnson": ["Appointment with Dr. Brown - March 22, 2024", "Appointment with Dr. Garcia - March 25, 2024"]
  };

  const handleFormSubmit = async (formName: string, formData?: any) => {
    try {
      if (formName === "Patient Registration" && formData) {
        const response = await fetch(`${API_BASE_URL}/patient/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        toast({
          title: "Success",
          description: "Patient registered successfully!",
          variant: "default",
        });
      } else {
        // Handle other form submissions with default toast
        toast({
          title: "Success",
          description: `${formName} completed successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    }
  };

  const handleAddPatientInsurance = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addInsurancePatientUsername || !addInsuranceProviderId || !addInsurancePolicyNumber) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/add-patient-insurance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientUsername: addInsurancePatientUsername,
          insuranceId: parseInt(addInsuranceProviderId),
          policyNumber: addInsurancePolicyNumber
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: "Patient insurance registered successfully! Status: waiting approval",
        });
        
        // Reset form
        setAddInsurancePatientUsername("");
        setAddInsuranceProviderId("");
        setAddInsurancePolicyNumber("");
        
        // Refresh pending insurances
        const res = await fetch(`${API_BASE_URL}/appointments/pending-insurances`);
        const insuranceData = await res.json();
        if (res.ok) {
          const insurances = Array.isArray(insuranceData.insurances) ? insuranceData.insurances.map((item: any) => ({
            username: item.patient_username,
            insuranceId: item.insurance_id,
            approved: item.status === 'Approved',
            policyNumber: item.policy_number,
            providerName: item.provider_name,
            coveragePercentage: item.coverage_percentage
          })) : [];
          setPendingInsurances(insurances);
        }
      } else {
        throw new Error(data.message || 'Failed to add patient insurance');
      }
    } catch (error) {
      console.error('Error adding patient insurance:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to add patient insurance',
        variant: "destructive",
      });
    }
  };

  const fetchPatientInsurancesByBillId = async (billId: string) => {
    if (!billId || billId.trim() === '') {
      setAvailableInsurances([]);
      return;
    }

    setIsLoadingInsurances(true);
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/patient-insurances-by-bill/${billId}`);
      const data = await response.json();

      if (response.ok) {
        setAvailableInsurances(data.data.insurances || []);
        
        if (data.data.insurances && data.data.insurances.length > 0) {
          toast({
            title: "Insurances Found",
            description: `Found ${data.data.insurances.length} insurance(s) for this patient`,
          });
        } else {
          toast({
            title: "No Insurance Found",
            description: "This patient doesn't have any registered insurance",
            variant: "default",
          });
        }
      } else {
        throw new Error(data.message || 'Failed to fetch patient insurances');
      }
    } catch (error) {
      console.error('Error fetching patient insurances:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to fetch patient insurances',
        variant: "destructive",
      });
      setAvailableInsurances([]);
    } finally {
      setIsLoadingInsurances(false);
    }
  };

  const handleInsuranceClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!claimBillId || !claimInsuranceId) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/submit-insurance-claim`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          billId: parseInt(claimBillId),
          insuranceId: parseInt(claimInsuranceId)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Insurance claim submitted successfully! Claim ID: ${data.data.claimId}`,
        });
        
        // Reset form
        setClaimBillId("");
        setClaimInsuranceId("");
        setAvailableInsurances([]);
        
        // Refresh pending insurances
        const res = await fetch(`${API_BASE_URL}/appointments/pending-insurances`);
        const insuranceData = await res.json();
        if (res.ok) {
          const insurances = Array.isArray(insuranceData.insurances) ? insuranceData.insurances.map((item: any) => ({
            username: item.patient_username,
            insuranceId: item.insurance_id,
            approved: item.status === 'Approved',
            policyNumber: item.policy_number,
            providerName: item.provider_name,
            coveragePercentage: item.coverage_percentage
          })) : [];
          setPendingInsurances(insurances);
        }
      } else {
        throw new Error(data.message || 'Failed to submit insurance claim');
      }
    } catch (error) {
      console.error('Error submitting insurance claim:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to submit insurance claim',
        variant: "destructive",
      });
    }
  };

  const handleBillDetailsFetch = async (appointmentId: string) => {
    if (!appointmentId || appointmentId.trim() === '') {
      setBillDetails(null);
      return;
    }

    setIsGeneratingBill(true);
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/generate-bill/${appointmentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        console.log('=== FRONTEND RECEIVED BILL DATA ===');
        console.log('Full response data:', data);
        console.log('Appointment data:', data.data?.appointment);
        console.log('Bill data:', data.data?.bill);
        
        // Derive monetary values robustly
        const totalAmountNum = parseFloat(data.data.bill.Total_Amount) || 0;
        const insuredAmountNum = parseFloat(data.data.bill.Insured_Amount || 0) || 0;
        const totalPaidNum = parseFloat(data.data.paymentInfo?.totalPaid || 0) || 0;
        const computedDue = Math.max(0, parseFloat((totalAmountNum - insuredAmountNum - totalPaidNum).toFixed(2)));

        // Transform the data to match the expected structure
        const transformedData = {
          appointment: data.data.appointment,
          bill: data.data.bill,
          totals: {
            totalAmount: totalAmountNum,
            insuredAmount: insuredAmountNum,
            amountToBePaid: computedDue
          },
          paymentInfo: data.data.paymentInfo,
          patientInsurance: data.data.bill.insurance_provider ? {
            Provider_Name: data.data.bill.insurance_provider,
            Coverage_Percentage: String(data.data.bill.coverage_percentage ?? '0'),
            Policy_Number: data.data.bill.policy_number ?? 'N/A'
          } : null,
          insuranceClaims: [] // Empty for now, could be populated if needed
        };
        
        // Try to enrich with actual patient insurance info and compute fallback insured amount if missing
        let finalData = transformedData;
        try {
          const billId = data.data?.bill?.Bill_ID;
          if (billId) {
            const insRes = await fetch(`${API_BASE_URL}/appointments/patient-insurances-by-bill/${billId}`);
            const insJson = await insRes.json();
            if (insRes.ok && Array.isArray(insJson?.data?.insurances) && insJson.data.insurances.length > 0) {
              const firstIns = insJson.data.insurances[0];
              const coveragePct = parseFloat(firstIns?.Coverage_Percentage || '0') || 0;
              const providerName = firstIns?.Provider_Name || finalData.patientInsurance?.Provider_Name || null;
              const policyNumber = firstIns?.Policy_Number || 'N/A';

              // Compute insured amount if backend didn't provide one (>0 means backend already applied insurance)
              if (!isNaN(finalData.totals.totalAmount)) {
                const backendInsured = finalData.totals.insuredAmount || 0;
                if (backendInsured <= 0 && coveragePct > 0) {
                  const computedInsured = parseFloat(((finalData.totals.totalAmount * coveragePct) / 100).toFixed(2));
                  const totalPaid = parseFloat(finalData.paymentInfo?.totalPaid || 0);
                  const computedPatientAmount = finalData.totals.totalAmount - computedInsured;
                  const computedRemaining = Math.max(0, parseFloat((computedPatientAmount - totalPaid).toFixed(2)));

                  finalData = {
                    ...finalData,
                    patientInsurance: providerName ? {
                      Provider_Name: providerName,
                      Coverage_Percentage: String(coveragePct),
                      Policy_Number: policyNumber
                    } : finalData.patientInsurance,
                    totals: {
                      ...finalData.totals,
                      insuredAmount: computedInsured,
                      amountToBePaid: computedRemaining
                    }
                  };
                } else if (providerName) {
                  // Even if backend insured is present, enrich provider/coverage/policy for display
                  finalData = {
                    ...finalData,
                    patientInsurance: {
                      Provider_Name: providerName,
                      Coverage_Percentage: String(coveragePct || parseFloat(finalData.patientInsurance?.Coverage_Percentage || '0') || 0),
                      Policy_Number: policyNumber
                    }
                  };
                }
              }
            }
          }
        } catch (e) {
          console.error('Error enriching bill with insurance details:', e);
        }

        setBillDetails(finalData);
        
        toast({
          title: data.data.isNewBill ? "Bill Generated Successfully" : "Bill Retrieved",
          description: data.data.isNewBill ? 
            `New bill created for appointment ${appointmentId}` : 
            `Existing bill retrieved for appointment ${appointmentId}`,
        });
      } else {
        // Fallback: try to fetch existing bill details via GET endpoint
        console.warn('Generate bill failed, attempting fallback fetch...', data);
        const fbRes = await fetch(`${API_BASE_URL}/appointments/bill-details/${appointmentId}`);
        const fbJson = await fbRes.json();
        if (fbRes.ok) {
          const gb = fbJson.data;
          const transformed = {
            appointment: gb.appointment,
            bill: gb.billing,
            totals: gb.totals,
            paymentInfo: {
              totalPaid: 0,
              remainingAmount: gb.totals?.amountToBePaid ?? 0,
              isFullyPaid: (gb.totals?.amountToBePaid ?? 0) <= 0
            },
            patientInsurance: gb.patientInsurance ? {
              Provider_Name: gb.patientInsurance.Provider_Name,
              Coverage_Percentage: String(gb.patientInsurance.Coverage_Percentage ?? '0'),
              Policy_Number: gb.patientInsurance.Policy_Number ?? 'N/A'
            } : null,
            insuranceClaims: Array.isArray(gb.insuranceClaims) ? gb.insuranceClaims : []
          };
          setBillDetails(transformed);
          toast({
            title: "Bill Retrieved",
            description: `Existing bill retrieved for appointment ${appointmentId}`,
          });
        } else {
          throw new Error(data?.error || data?.message || fbJson?.error || fbJson?.message || 'Failed to generate bill');
        }
      }
    } catch (error) {
      console.error('Error generating bill:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate bill',
        variant: "destructive",
      });
      setBillDetails(null);
    } finally {
      setIsGeneratingBill(false);
    }
  };

  // Add useEffect for debounced API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (billAppointmentId) {
        handleBillDetailsFetch(billAppointmentId);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [billAppointmentId]);

  // Add useEffect for fetching patient insurances when bill ID changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (claimBillId) {
        fetchPatientInsurancesByBillId(claimBillId);
      } else {
        setAvailableInsurances([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [claimBillId]);

  // Patient registration functions
  const checkUsernameAvailability = async (username: string) => {
    if (!username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setIsCheckingUsername(true);
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/check-username/${encodeURIComponent(username)}`);
      const data = await response.json();

      if (response.ok) {
        setUsernameAvailable(data.available);
      } else {
        setUsernameAvailable(null);
      }
    } catch (error) {
      console.error('Error checking username availability:', error);
      setUsernameAvailable(null);
    } finally {
      setIsCheckingUsername(false);
    }
  };


  const handlePatientRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!patientFormData.username || !patientFormData.password || !patientFormData.name || 
        !patientFormData.phone || !patientFormData.dateOfBirth || 
        !patientFormData.gender) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if username is available
    if (usernameAvailable === false) {
      toast({
        title: "Error",
        description: "Username is already taken. Please choose a different username.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/appointments/register-patient`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientFormData)
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: `Patient registered successfully! Username: ${data.data.username}`,
        });
        
        // Reset form
        setPatientFormData({
          username: "",
          password: "",
          name: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          address: ""
        });
        setUsernameAvailable(null);
      } else {
        throw new Error(data.message || 'Failed to register patient');
      }
    } catch (error) {
      console.error('Error registering patient:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to register patient',
        variant: "destructive",
      });
    }
  };

  const generateReceipt = async () => {
    if (!billDetails) return;

    // Update payment amount in the database if user has entered an amount
    if (userPaymentAmount && parseFloat(userPaymentAmount) > 0) {
      // Validate that payment doesn't exceed amount owed
      const paymentAmount = parseFloat(userPaymentAmount);
      if (paymentAmount > billDetails.totals.amountToBePaid) {
        toast({
          title: "Invalid Payment Amount",
          description: `Payment amount ($${paymentAmount.toFixed(2)}) cannot exceed the amount owed ($${billDetails.totals.amountToBePaid.toFixed(2)})`,
          variant: "destructive",
        });
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/appointments/update-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            billId: billDetails.bill.Bill_ID,
            amountPaid: paymentAmount
          }),
        });

        const data = await response.json();

        if (response.ok) {
          toast({
            title: "Payment Recorded Successfully",
            description: `Payment of $${userPaymentAmount} recorded. Total paid: $${data.data.totalPaidSoFar.toFixed(2)}. Remaining: $${data.data.remainingAmount.toFixed(2)}`,
          });
          
          // Update the bill details to reflect the new payment status
          if (billDetails) {
            const updatedBillDetails = {
              ...billDetails,
              totals: {
                ...billDetails.totals,
                amountToBePaid: data.data.remainingAmount
              }
            };
            setBillDetails(updatedBillDetails);
          }
        } else {
          throw new Error(data.message || 'Failed to record payment');
        }
      } catch (error) {
        console.error('Error updating payment:', error);
        
        // Try to parse error message for better user feedback
        let errorMessage = 'Failed to record payment';
        if (error instanceof Error) {
          errorMessage = error.message;
        }
        
        toast({
          title: "Payment Error",
          description: errorMessage,
          variant: "destructive",
        });
        return; // Don't generate receipt if payment update fails
      }
    }

    // Create PDF content using HTML
    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Medical Bill Receipt</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
          .section { margin-bottom: 15px; }
          .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px; }
          .info-item { display: flex; justify-content: space-between; }
          .amounts { background-color: #f5f5f5; padding: 10px; border-radius: 5px; }
          .total { font-weight: bold; font-size: 1.1em; }
          .footer { margin-top: 30px; text-align: center; font-size: 0.9em; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>MEDICAL BILL RECEIPT</h1>
        </div>
        
        <div class="section">
          <h3>Appointment Details</h3>
          <div class="info-grid">
            <div class="info-item">
              <span><strong>Appointment ID:</strong></span>
              <span>${billDetails.appointment.Appointment_ID}</span>
            </div>
            <div class="info-item">
              <span><strong>Patient:</strong></span>
              <span>${billDetails.appointment.patient_name} (${billDetails.appointment.patient_username})</span>
            </div>
            <div class="info-item">
              <span><strong>Doctor:</strong></span>
              <span>${billDetails.appointment.doctor_name}</span>
            </div>
            <div class="info-item">
              <span><strong>Appointment Date:</strong></span>
              <span>${new Date(billDetails.appointment.Appointment_Date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Billing Information</h3>
          <div class="info-grid">
            <div class="info-item">
              <span><strong>Bill ID:</strong></span>
              <span>${billDetails.bill.Bill_ID}</span>
            </div>
            <div class="info-item">
              <span><strong>Bill Date:</strong></span>
              <span>${new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>Financial Summary</h3>
          <div class="amounts">
            <div class="info-item">
              <span>Total Amount:</span>
              <span>$${billDetails.totals.totalAmount.toFixed(2)}</span>
            </div>
            ${billDetails.patientInsurance ? `
            <div class="info-item">
              <span>Insurance Provider:</span>
              <span>${billDetails.patientInsurance.Provider_Name}</span>
            </div>
            <div class="info-item">
              <span>Coverage Percentage:</span>
              <span>${billDetails.patientInsurance.Coverage_Percentage}%</span>
            </div>
            <div class="info-item">
              <span>Policy Number:</span>
              <span>${billDetails.patientInsurance.Policy_Number}</span>
            </div>
            ` : ''}
            <div class="info-item">
              <span>Insured Amount:</span>
              <span>$${billDetails.totals.insuredAmount.toFixed(2)}</span>
            </div>
            <div class="info-item total">
              <span>Amount to be Paid:</span>
              <span>$${billDetails.totals.amountToBePaid.toFixed(2)}</span>
            </div>
            ${userPaymentAmount ? `
            <div class="info-item">
              <span>Amount Paid by User:</span>
              <span>$${parseFloat(userPaymentAmount).toFixed(2)}</span>
            </div>
            ${parseFloat(userPaymentAmount) === billDetails.totals.amountToBePaid ? 
              '<div class="info-item" style="color: green; font-weight: bold;"><span>✓ Payment Complete - No Balance Remaining</span></div>' :
              `<div class="info-item" style="color: orange; font-weight: bold;"><span>$${(billDetails.totals.amountToBePaid - parseFloat(userPaymentAmount)).toFixed(2)} remaining</span></div>`
            }
            ` : ''}
          </div>
        </div>

        <div class="section">
          <h3>Insurance Claims</h3>
          ${billDetails.insuranceClaims.length > 0 ? 
            billDetails.insuranceClaims.map((claim: any) => `
              <div class="info-item">
                <span>Claim ID: ${claim.Insurance_Claim_ID} | Provider: ${claim.Provider_Name}</span>
                <span>$${claim.Claim_Amount} (${claim.Claim_Status})</span>
              </div>
            `).join('') : 
            '<div>No insurance claims</div>'
          }
        </div>

        <div class="footer">
          <p>Generated on: ${new Date().toLocaleString()}</p>
          <p>Thank you for choosing our medical services!</p>
        </div>
      </body>
      </html>
    `;

    // Generate PDF using html2pdf.js
    try {
      const element = document.createElement('div');
      element.innerHTML = pdfContent;
      document.body.appendChild(element);

      const opt = {
        margin: 0.5,
        filename: `medical-receipt-${billDetails.bill.Bill_ID}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
      };

      await html2pdf().set(opt).from(element).save();
      
      document.body.removeChild(element);

      toast({
        title: "Success",
        description: "PDF receipt downloaded successfully!",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
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
              <h1 className={`font-bold tracking-tight ${isMobile ? 'text-xl' : 'text-3xl'}`}>Receptionist Dashboard</h1>
              <p className={`text-primary-foreground/90 ${isMobile ? 'text-sm' : 'text-lg'}`}>Streamlined management for appointments and patients</p>
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
                  onClick={() => setActiveTab('appointments')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'appointments' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'appointments' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <CalendarDays className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Appointments</span>
                </button>
                {/* Doctors tab removed */}
                <button
                  onClick={() => setActiveTab('insurance')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'insurance' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'insurance' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Insurance</span>
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 transform hover:scale-105 ${
                    activeTab === 'billing' 
                      ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                      : 'hover:bg-gradient-to-r hover:from-muted/50 hover:to-accent/10 hover:shadow-md'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${activeTab === 'billing' ? 'bg-white/20' : 'bg-primary/10'}`}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="font-medium">Billing</span>
                </button>
              </nav>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${isMobile ? 'p-4' : 'p-8'} bg-gradient-to-br from-background to-muted/20`}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">

          <TabsContent value="appointments" className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">Appointment Management</h2>
              <p className="text-muted-foreground mb-8">Efficiently manage all appointment operations</p>
            </div>
            <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-full bg-gradient-primary">
                    <CalendarDays className="w-6 h-6 text-primary-foreground" />
                  </div>
                  Appointment Operations
                </CardTitle>
                <p className="text-muted-foreground ml-12">Book, reschedule, or cancel appointments with ease</p>
              </CardHeader>
              <CardContent>
                <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'md:grid-cols-3 gap-6'} mb-8`}>
                  
                  {/* Book Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-gradient-primary mx-auto mb-4 w-fit">
                            <CalendarDays className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Book Appointment</h3>
                          <p className="text-sm text-muted-foreground">Schedule new appointments</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Book New Appointment</DialogTitle>
                        <DialogDescription>Schedule a new appointment for a patient</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          if (!bookPatientUsername || !bookSpecialization || !bookDoctor || !bookDate || !bookTimeSlot) {
                            toast({
                              title: "Error",
                              description: "All fields are required",
                              variant: "destructive",
                            });
                            return;
                          }

                          // Find the doctor ID from the selected doctor name
                          const selectedDoctor = doctorsData.find(doc => doc.name === bookDoctor);
                          if (!selectedDoctor) {
                            toast({
                              title: "Error",
                              description: "Selected doctor not found",
                              variant: "destructive",
                            });
                            return;
                          }

                          const appointmentData = {
                            patientUsername: bookPatientUsername,
                            doctorId: selectedDoctor.id,
                            appointmentDate: format(bookDate, 'yyyy-MM-dd'),
                            timeSlot: bookTimeSlot,
                            specialization: bookSpecialization,
                            branch: bookBranch
                          };

                          console.log('Sending appointment data:', appointmentData);

                          // Get access token from localStorage for authentication
                          const accessToken = localStorage.getItem('accessToken');
                          
                          const response = await fetch(`${API_BASE_URL}/appointments/book`, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                              ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
                            },
                            credentials: 'include', // Include cookies for authentication
                            body: JSON.stringify(appointmentData)
                          });

                          if (!response.ok) {
                            const errorData = await response.json();
                            throw new Error(errorData.message || 'Failed to book appointment');
                          }

                          // Clear form
                          setBookPatientUsername('');
                          setBookSpecialization('');
                          setBookDoctor('');
                          setBookDate(undefined);
                          setBookTimeSlot('');
                          setBookBranch('Colombo');

                          toast({
                            title: "Success",
                            description: "Appointment booked successfully!",
                          });
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: error instanceof Error ? error.message : "Failed to book appointment",
                            variant: "destructive",
                          });
                        }
                      }} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="bookPatientUsername">Patient Username</Label>
                          <Input 
                            id="bookPatientUsername" 
                            placeholder="Enter patient username" 
                            value={bookPatientUsername}
                            onChange={(e) => setBookPatientUsername(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookBranch">Branch</Label>
                          <Select value={bookBranch} onValueChange={setBookBranch} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select branch" />
                            </SelectTrigger>
                            <SelectContent>
                              {branches.map((branch) => (
                                <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookSpecialization">Specialization</Label>
                          <Select value={bookSpecialization} onValueChange={(value) => {
                            setBookSpecialization(value);
                            setBookDoctor(""); // Reset doctor when specialization changes
                          }} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select specialization" />
                            </SelectTrigger>
                            <SelectContent>
                              {specializationsData.map((spec) => (
                                <SelectItem key={spec.id} value={spec.name}>{spec.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookDoctor">Doctor</Label>
                          <Select value={bookDoctor} onValueChange={setBookDoctor} required disabled={!bookSpecialization}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select doctor" />
                            </SelectTrigger>
                            <SelectContent>
                              {bookSpecialization && doctorsData.map((doctor) => (
                                <SelectItem key={doctor.id} value={doctor.name}>{doctor.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Appointment Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !bookDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {bookDate ? format(bookDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={bookDate}
                                onSelect={setBookDate}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bookTimeSlot">Time Slot</Label>
                          <Select value={bookTimeSlot} onValueChange={setBookTimeSlot} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {(availableSlots.length ? availableSlots : []).map((slot) => (
                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button type="submit" className="w-full">Book Appointment</Button>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Reschedule Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-secondary/5 to-accent/5 border-secondary/20 cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-gradient-secondary mx-auto mb-4 w-fit">
                            <CheckCircle className="w-8 h-8 text-secondary-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Reschedule</h3>
                          <p className="text-sm text-muted-foreground">Change appointment dates</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Reschedule Appointment</DialogTitle>
                        <DialogDescription>Reschedule an existing appointment to a new date</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Appointment Rescheduling");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="reschedulePatientUsername">Patient Username</Label>
                          <Input 
                            id="reschedulePatientUsername" 
                            placeholder="Enter patient username" 
                            value={reschedulePatientUsername}
                            onChange={(e) => setReschedulePatientUsername(e.target.value)}
                            required 
                          />
                        </div>
                          <div className="space-y-2">
                          <Label htmlFor="rescheduleAppointmentId">Appointment ID</Label>
                          <Input 
                            id="rescheduleAppointmentId" 
                            placeholder="Enter appointment ID" 
                            value={rescheduleAppointmentId}
                            onChange={(e) => setRescheduleAppointmentId(e.target.value)}
                            required 
                          />
                              </div>
                        <div className="space-y-2">
                          <Label>New Appointment Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !rescheduleDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {rescheduleDate ? format(rescheduleDate, "PPP") : <span>Pick a new date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={rescheduleDate}
                                onSelect={setRescheduleDate}
                                initialFocus
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rescheduleTimeSlot">New Time Slot</Label>
                          <Select value={rescheduleTimeSlot} onValueChange={setRescheduleTimeSlot} required>
                            <SelectTrigger>
                              <SelectValue placeholder="Select new time slot" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeSlots.map((slot) => (
                                <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline">Close</Button>
                          <Button 
                            type="submit" 
                            onClick={async () => {
                              try {
                                if (!rescheduleAppointmentId || !rescheduleDate || !rescheduleTimeSlot) {
                                  throw new Error("Appointment ID, date and time slot are required");
                                }
                                const payload = {
                                  appointmentId: Number(rescheduleAppointmentId),
                                  newDate: rescheduleDate ? format(rescheduleDate, 'yyyy-MM-dd') : '',
                                  newTimeSlot: rescheduleTimeSlot
                                };
                                
                                const accessToken = localStorage.getItem('accessToken');
                                const response = await fetch(`${API_BASE_URL}/appointments/reschedule`, {
                                  method: 'POST',
                                  headers: { 
                                    'Content-Type': 'application/json',
                                    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
                                  },
                                  credentials: 'include',
                                  body: JSON.stringify(payload)
                                });
                                const data = await response.json();
                                if (!response.ok) {
                                  throw new Error(data.message || 'Failed to reschedule appointment');
                                }
                                toast({
                                  title: "Appointment Rescheduled",
                                  description: `Patient: ${data.details?.patientUsername || reschedulePatientUsername}\nPrevious: ${data.details?.previousDate || ''} ${data.details?.previousTime || ''}\nNew: ${data.details?.newDate || payload.newDate} ${data.details?.newTimeSlot || payload.newTimeSlot}`
                                });
                              } catch (err) {
                                toast({
                                  title: "Error",
                                  description: err instanceof Error ? err.message : 'Failed to reschedule',
                                  variant: "destructive",
                                });
                              }
                            }} 
                            className="bg-gradient-primary text-primary-foreground"
                          >Reschedule</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  {/* Cancel Appointment */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-destructive/5 to-accent/5 border-destructive/20 cursor-pointer">
                        <CardContent className="p-6 text-center">
                          <div className="p-4 rounded-full bg-destructive mx-auto mb-4 w-fit">
                            <X className="w-8 h-8 text-destructive-foreground" />
                          </div>
                          <h3 className="font-semibold text-lg mb-2">Cancel</h3>
                          <p className="text-sm text-muted-foreground">Cancel existing appointments</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Cancel Appointment</DialogTitle>
                        <DialogDescription>Cancel an existing appointment</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={(e) => {e.preventDefault(); handleFormSubmit("Appointment Cancellation");}} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cancelAppointmentId">Appointment ID</Label>
                          <Input 
                            id="cancelAppointmentId" 
                            placeholder="Enter appointment ID" 
                            value={cancelAppointmentId}
                            onChange={(e) => setCancelAppointmentId(e.target.value)}
                            required 
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline">Close</Button>
                          <Button 
                            type="submit" 
                            onClick={async () => {
                              try {
                                if (!cancelAppointmentId) {
                                  throw new Error('Appointment ID is required');
                                }
                                const payload = { appointmentId: Number(cancelAppointmentId) };
                                
                                const accessToken = localStorage.getItem('accessToken');
                                const response = await fetch(`${API_BASE_URL}/appointments/cancel`, {
                                  method: 'POST',
                                  headers: { 
                                    'Content-Type': 'application/json',
                                    ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
                                  },
                                  credentials: 'include',
                                  body: JSON.stringify(payload)
                                });
                                const data = await response.json();
                                if (!response.ok) {
                                  throw new Error(data.message || 'Failed to cancel appointment');
                                }
                                toast({
                                  title: "Appointment Cancelled",
                                  description: `Appointment ${payload.appointmentId} status: ${data.appointment?.status || 'Cancelled'}`
                                });
                                setCancelAppointmentId("");
                              } catch (err) {
                                toast({
                                  title: "Error",
                                  description: err instanceof Error ? err.message : 'Failed to cancel',
                                  variant: "destructive",
                                });
                              }
                            }}
                            className="bg-gradient-primary text-primary-foreground"
                          >Cancel Appointment</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                </div>
              </CardContent>
            </Card>

            {/* Patient Management Section */}
            <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-full bg-gradient-secondary">
                    <Users className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  Patient Management
                </CardTitle>
                <p className="text-muted-foreground ml-12">Register new patients and manage patient information</p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card className="hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-success/5 to-accent/5 border-success/20 cursor-pointer">
                        <CardContent className="p-8 text-center">
                          <div className="p-4 rounded-full bg-success mx-auto mb-4 w-fit">
                            <UserPlus className="w-10 h-10 text-success-foreground" />
                          </div>
                          <h3 className="font-semibold text-xl mb-2">Register Patient</h3>
                          <p className="text-sm text-muted-foreground">Add new patients to the system</p>
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl text-primary">Register New Patient</DialogTitle>
                        <DialogDescription>Enter patient details to register them in the system</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handlePatientRegistration} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="patientName">Full Name *</Label>
                            <Input 
                              id="patientName" 
                              value={patientFormData.name}
                              onChange={(e) => setPatientFormData({...patientFormData, name: e.target.value})}
                              placeholder="Enter patient name" 
                              required 
                              className="border-primary/20 focus:border-primary" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientDOB">Date of Birth *</Label>
                            <Input 
                              id="patientDOB" 
                              type="date" 
                              value={patientFormData.dateOfBirth}
                              onChange={(e) => setPatientFormData({...patientFormData, dateOfBirth: e.target.value})}
                              required 
                              className="border-primary/20 focus:border-primary" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientGender">Gender *</Label>
                            <Select 
                              value={patientFormData.gender}
                              onValueChange={(value) => setPatientFormData({...patientFormData, gender: value})}
                              required
                            >
                              <SelectTrigger className="border-primary/20 focus:border-primary">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientPhone">Phone Number *</Label>
                            <Input 
                              id="patientPhone" 
                              value={patientFormData.phone}
                              onChange={(e) => setPatientFormData({...patientFormData, phone: e.target.value})}
                              placeholder="Enter phone number" 
                              required 
                              className="border-primary/20 focus:border-primary" 
                            />
                          </div>
                          <div className="space-y-2 col-span-2">
                            <Label htmlFor="patientAddress">Address</Label>
                            <Input 
                              id="patientAddress" 
                              value={patientFormData.address}
                              onChange={(e) => setPatientFormData({...patientFormData, address: e.target.value})}
                              placeholder="Enter address" 
                              className="border-primary/20 focus:border-primary" 
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientUsername">Username *</Label>
                            <div className="relative">
                              <Input 
                                id="patientUsername" 
                                type="text" 
                                value={patientFormData.username}
                                onChange={(e) => {
                                  setPatientFormData({...patientFormData, username: e.target.value});
                                  checkUsernameAvailability(e.target.value);
                                }}
                                placeholder="Enter username" 
                                required 
                                className="border-primary/20 focus:border-primary" 
                              />
                              {isCheckingUsername && (
                                <div className="absolute right-2 top-2">
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          </div>
                              )}
                              {usernameAvailable === true && (
                                <div className="absolute right-2 top-2 text-green-500">✓</div>
                              )}
                              {usernameAvailable === false && (
                                <div className="absolute right-2 top-2 text-red-500">✗</div>
                              )}
                          </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="patientPassword">Password *</Label>
                            <Input 
                              id="patientPassword" 
                              type="password" 
                              value={patientFormData.password}
                              onChange={(e) => setPatientFormData({...patientFormData, password: e.target.value})}
                              placeholder="Enter password" 
                              required 
                              className="border-primary/20 focus:border-primary" 
                            />
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                          Register Patient
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Doctors tab removed */}

          <TabsContent value="insurance" className="space-y-4">
            {/* Add Patient Insurance Section */}
            <Card className="shadow-hero bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <div className="p-3 rounded-full bg-gradient-primary">
                    <Shield className="w-6 h-6 text-primary-foreground" />
                  </div>
                  Register Patient Insurance
                </CardTitle>
                <CardDescription className="ml-12">Add insurance details for patients</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog>
                  <DialogTrigger asChild>
                    <Card className="hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30 ring-1 ring-primary/20 shadow-lg shadow-primary/20 cursor-pointer max-w-md mx-auto">
                      <CardContent className="p-8 text-center">
                        <div className="p-4 rounded-full bg-gradient-primary mx-auto mb-4 w-fit">
                          <Shield className="w-10 h-10 text-primary-foreground" />
                        </div>
                        <h3 className="font-semibold text-xl mb-2">Add Patient Insurance</h3>
                        <p className="text-sm text-muted-foreground">Register insurance for a patient</p>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] bg-gradient-to-b from-card to-primary/5 border-primary/20">
                    <DialogHeader>
                      <DialogTitle className="text-xl bg-gradient-primary bg-clip-text text-transparent">Add Patient Insurance</DialogTitle>
                      <DialogDescription className="text-muted-foreground">Enter patient and insurance details to register</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddPatientInsurance} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="addInsurancePatientUsername">Patient Username *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input 
                            id="addInsurancePatientUsername" 
                            placeholder="Enter patient username" 
                            value={addInsurancePatientUsername}
                            onChange={(e) => setAddInsurancePatientUsername(e.target.value)}
                            required 
                            className="border-primary/20 focus:border-primary pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">Use the patient's portal username.</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addInsuranceProviderId">Insurance Provider *</Label>
                        <Select 
                          value={addInsuranceProviderId} 
                          onValueChange={setAddInsuranceProviderId}
                          required
                        >
                          <div className="relative">
                            <Shield className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                            <SelectTrigger className="border-primary/20 focus:border-primary pl-10">
                              <SelectValue placeholder="Select insurance provider" />
                            </SelectTrigger>
                          </div>
                          <SelectContent>
                            {insuranceProviders.map((provider) => (
                              <SelectItem key={provider.Insurance_ID} value={provider.Insurance_ID.toString()}>
                                {provider.Provider_Name} - {provider.Coverage_Percentage}% coverage
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedInsuranceProvider && (
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{selectedInsuranceProvider.Coverage_Percentage}% coverage</Badge>
                            <span className="text-xs text-muted-foreground">Provider: {selectedInsuranceProvider.Provider_Name}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="addInsurancePolicyNumber">Policy Number *</Label>
                        <div className="relative">
                          <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input 
                            id="addInsurancePolicyNumber" 
                            placeholder="Enter policy number" 
                            value={addInsurancePolicyNumber}
                            onChange={(e) => setAddInsurancePolicyNumber(e.target.value)}
                            required 
                            className="border-primary/20 focus:border-primary pl-10"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">As shown on the patient's insurance card.</p>
                      </div>
                      <Button type="submit" className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/30">
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Register Insurance
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            

            
          </TabsContent>

          <TabsContent value="billing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Billing
                  <Badge variant="secondary" className="ml-1">Secure</Badge>
                </CardTitle>
                <CardDescription>Generate bills and manage payment status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Generate Bill */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="flex items-center gap-2 h-20 flex-col">
                        <FileText className="h-6 w-6" />
                        Generate Bill
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Generate Bill</DialogTitle>
                        <DialogDescription>Create bill for appointments/treatments</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="appointmentId">Appointment ID</Label>
                          <Input 
                            id="appointmentId" 
                            placeholder="Enter appointment ID" 
                            value={billAppointmentId}
                            onChange={(e) => {
                              setBillAppointmentId(e.target.value);
                            }}
                            required 
                            disabled={isGeneratingBill}
                          />
                        </div>
                        {!billDetails && !isGeneratingBill && (
                          <div className="p-6 rounded-lg border border-dashed text-center text-muted-foreground">
                            <Receipt className="w-8 h-8 mx-auto mb-2 opacity-70" />
                            <p className="text-sm">Enter an Appointment ID to fetch billing details.</p>
                          </div>
                        )}
                        
                        {isGeneratingBill && (
                          <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 text-blue-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                              <span className="font-medium">Please wait for a moment!</span>
                            </div>
                          </div>
                        )}
                        
                        {billDetails && !isGeneratingBill && (
                          <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-semibold text-lg">Bill Details</h4>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium">Patient:</span> {billDetails.appointment.patient_name}
                        </div>
                              <div>
                                <span className="font-medium">Date:</span> {format(new Date(billDetails.appointment.Appointment_Date), 'yyyy-MM-dd')}
                        </div>
                              <div>
                                <span className="font-medium">Bill ID:</span> {billDetails.bill.Bill_ID}
                        </div>
                            </div>

                            <div className="border-t pt-4">
                              <h5 className="font-semibold mb-2">Financial Summary</h5>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Total Amount:</span>
                                  <span className="font-medium">${billDetails.totals.totalAmount.toFixed(2)}</span>
                        </div>
                                <div className="flex justify-between">
                                  <span>Insured Amount:</span>
                                  <span className="font-medium text-green-600">${billDetails.totals.insuredAmount.toFixed(2)}</span>
                        </div>
                                <div className="flex justify-between border-t pt-2">
                                  <span className="font-semibold">Amount to be Paid:</span>
                                  <span className="font-semibold text-blue-600">${billDetails.totals.amountToBePaid.toFixed(2)}</span>
                        </div>
                              </div>
                            </div>

                        <div className="space-y-2">
                              <Label htmlFor="userPaymentAmount">Amount Paid by User</Label>
                          <Input 
                                id="userPaymentAmount" 
                                type="number" 
                                placeholder={`Max: $${billDetails.totals.amountToBePaid.toFixed(2)}`}
                                value={userPaymentAmount}
                                onChange={(e) => setUserPaymentAmount(e.target.value)}
                                step="0.01"
                                min="0"
                                max={billDetails.totals.amountToBePaid}
                              />
                              <p className="text-xs text-muted-foreground">Maximum allowed: ${billDetails.totals.amountToBePaid.toFixed(2)}</p>
                              {userPaymentAmount && parseFloat(userPaymentAmount) > billDetails.totals.amountToBePaid && (
                                <div className="text-red-600 text-sm font-medium">
                                  ⚠️ Amount cannot exceed ${billDetails.totals.amountToBePaid.toFixed(2)} (amount owed)
                        </div>
                              )}
                              {userPaymentAmount && parseFloat(userPaymentAmount) > 0 && parseFloat(userPaymentAmount) <= billDetails.totals.amountToBePaid && parseFloat(userPaymentAmount) !== billDetails.totals.amountToBePaid && (
                                <div className="text-orange-600 text-sm font-medium">
                                  ${Math.max(0, billDetails.totals.amountToBePaid - parseFloat(userPaymentAmount)).toFixed(2)} remaining
                        </div>
                              )}
                            </div>

                            <Button 
                              type="button" 
                              onClick={generateReceipt}
                              className="w-full bg-green-600 hover:bg-green-700"
                            >
                              Generate Receipt
                            </Button>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>


                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>

    {/* Mobile Bottom Navigation */}
    {isMobile && (
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 shadow-lg">
        <div className="grid grid-cols-4 gap-1 p-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'appointments' 
                ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                : 'hover:bg-muted/50'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            <span className="text-xs font-medium">Appointments</span>
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'doctors' 
                ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                : 'hover:bg-muted/50'
            }`}
          >
            <Stethoscope className="w-5 h-5" />
            <span className="text-xs font-medium">Doctors</span>
          </button>
          <button
            onClick={() => setActiveTab('insurance')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'insurance' 
                ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                : 'hover:bg-muted/50'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-xs font-medium">Insurance</span>
          </button>
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex flex-col items-center gap-1 p-3 rounded-lg transition-all duration-300 ${
              activeTab === 'billing' 
                ? 'bg-gradient-primary text-primary-foreground shadow-button' 
                : 'hover:bg-muted/50'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs font-medium">Billing</span>
          </button>
        </div>
      </div>
    )}
  </div>
  );
};

export default ReceptionistDashboard;

