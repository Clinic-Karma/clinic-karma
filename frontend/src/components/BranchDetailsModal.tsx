import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Users, Stethoscope, Bed, Car } from 'lucide-react';

interface BranchDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BranchDetailsModal = ({ open, onOpenChange }: BranchDetailsModalProps) => {
  const branches = [
    {
      name: "MedSync Main Hospital",
      address: "123 Medical Center Dr, Healthcare City, HC 12345",
      phone: "+1 (555) 123-4567",
      hours: "24/7 Emergency & General Services",
      specialties: ["Emergency Medicine", "Cardiology", "Internal Medicine", "Surgery"],
      facilities: ["Emergency Room", "ICU", "Operating Theaters", "Laboratory", "Radiology"],
      beds: 150,
      doctors: 45,
      parking: "500 spaces available",
      isMain: true
    },
    {
      name: "MedSync Orthopedic Center",
      address: "456 Bone Care Ave, Specialty District, SD 12346",
      phone: "+1 (555) 123-4568",
      hours: "Mon-Sat: 7AM-8PM, Sun: 9AM-5PM",
      specialties: ["Orthopedic Surgery", "Sports Medicine", "Physical Therapy", "Rheumatology"],
      facilities: ["Orthopedic OR", "Rehabilitation Center", "Sports Medicine Lab", "MRI"],
      beds: 80,
      doctors: 22,
      parking: "200 spaces available",
      isMain: false
    },
    {
      name: "MedSync Neurology Wing",
      address: "789 Brain Health Blvd, Neural Plaza, NP 12347",
      phone: "+1 (555) 123-4569",
      hours: "Mon-Fri: 8AM-6PM, Emergency 24/7",
      specialties: ["Neurology", "Neurosurgery", "Stroke Care", "Epilepsy Treatment"],
      facilities: ["Neurology Lab", "Brain Imaging Center", "Stroke Unit", "EEG Lab"],
      beds: 60,
      doctors: 18,
      parking: "150 spaces available",
      isMain: false
    },
    {
      name: "MedSync Pediatric Clinic",
      address: "321 Children's Way, Family District, FD 12348",
      phone: "+1 (555) 123-4570",
      hours: "Mon-Fri: 8AM-6PM, Sat: 9AM-3PM",
      specialties: ["Pediatrics", "Child Psychology", "Vaccination", "Growth & Development"],
      facilities: ["Play Area", "Child-Friendly Rooms", "Vaccination Center", "Pediatric Lab"],
      beds: 30,
      doctors: 15,
      parking: "100 spaces available",
      isMain: false
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-6">Our Branch Locations</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {branches.map((branch, index) => (
            <Card key={index} className={`shadow-card hover:shadow-lg transition-all duration-300 ${branch.isMain ? 'border-primary' : ''}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    {branch.name}
                  </CardTitle>
                  {branch.isMain && (
                    <Badge className="bg-gradient-primary text-primary-foreground">Main Branch</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Contact & Hours */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Address</p>
                        <p className="text-sm text-muted-foreground">{branch.address}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{branch.phone}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-medium">Operating Hours</p>
                        <p className="text-sm text-muted-foreground">{branch.hours}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Car className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium">Parking</p>
                        <p className="text-sm text-muted-foreground">{branch.parking}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 py-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bed className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-bold text-primary">{branch.beds}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Beds</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Stethoscope className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-bold text-primary">{branch.doctors}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Doctors</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-2xl font-bold text-primary">24/7</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Support</p>
                  </div>
                </div>

                {/* Specialties & Facilities */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Medical Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {branch.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3 text-lg">Facilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {branch.facilities.map((facility, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {facility}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Info */}
        <div className="bg-gradient-subtle rounded-lg p-6 mt-8">
          <h3 className="text-xl font-bold text-center mb-4">Need Help Finding Us?</h3>
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              All our locations are easily accessible by public transport and have ample parking facilities.
            </p>
            <p className="text-muted-foreground">
              For directions or transportation assistance, please call our main number: 
              <span className="font-medium text-primary"> +1 (555) 123-4567</span>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BranchDetailsModal;