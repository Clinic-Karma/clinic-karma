import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, CreditCard, History, Users, TrendingUp, Star, MapPin, Phone, Mail, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import AuthModal from './AuthModal';
import SignUpModal from './SignUpModal';
import PatientLoginModal from './PatientLoginModal';
import heroImage from '@/assets/medical-hero.jpg';
import doctor1 from '@/assets/doctor-1.jpg';
import doctor2 from '@/assets/doctor-2.jpg';
import doctor3 from '@/assets/doctor-3.jpg';
const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isPatientLoginOpen, setIsPatientLoginOpen] = useState(false);
  const [expandedBenefit, setExpandedBenefit] = useState<number | null>(null);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const benefits = [{
    icon: Calendar,
    title: "Easy Appointment Scheduling",
    description: "Book appointments with your preferred doctors in just a few clicks",
    expandedDescription: "Our advanced booking system allows you to select your preferred doctor, choose available time slots, and receive instant confirmation. You can also reschedule or cancel appointments with ease, and receive automated reminders via SMS and email."
  }, {
    icon: FileText,
    title: "Centralized Patient Records",
    description: "Access all your medical records, prescriptions, and treatment history in one place",
    expandedDescription: "Your complete medical journey is stored securely in our digital platform. View past consultations, download prescriptions, track medication schedules, and share your medical history with new healthcare providers instantly."
  }, {
    icon: CreditCard,
    title: "Transparent Billing & Insurance",
    description: "Clear billing statements with insurance integration for hassle-free payments",
    expandedDescription: "Receive detailed billing statements with itemized charges, insurance coverage details, and co-payment information. Our system integrates with major insurance providers for direct billing and claim processing."
  }, {
    icon: History,
    title: "Lab Reports & Treatment History",
    description: "Digital access to all your lab reports and complete treatment history",
    expandedDescription: "Access all your lab results, X-rays, and diagnostic reports online. Compare historical data with charts and graphs, and share reports with specialists. All reports are available 24/7 from any device."
  }];
  const doctors = [{
    name: "Dr. Priya Sharma",
    specialization: "Cardiologist",
    image: doctor1,
    availability: "Mon-Fri 9AM-5PM",
    rating: 4.9
  }, {
    name: "Dr. Marcus Johnson",
    specialization: "Orthopedic Surgeon",
    image: doctor2,
    availability: "Tue-Sat 10AM-6PM",
    rating: 4.8
  }, {
    name: "Dr. Carlos Rodriguez",
    specialization: "Neurologist",
    image: doctor3,
    availability: "Mon-Thu 8AM-4PM",
    rating: 4.9
  }, {
    name: "Dr. Sarah Chen",
    specialization: "Pediatrician",
    image: doctor1,
    availability: "Mon-Fri 8AM-6PM",
    rating: 4.9
  }, {
    name: "Dr. Robert Kim",
    specialization: "Dermatologist",
    image: doctor2,
    availability: "Wed-Sun 9AM-5PM",
    rating: 4.7
  }, {
    name: "Dr. Maria Lopez",
    specialization: "Gynecologist",
    image: doctor3,
    availability: "Mon-Fri 10AM-4PM",
    rating: 4.8
  }];

  const newsItems = [
    {
      title: "AI-Powered Diagnostics",
      description: "Advanced AI assistance for more accurate and faster diagnosis",
      icon: TrendingUp
    },
    {
      title: "Telemedicine Integration",
      description: "Connect with your healthcare providers from anywhere",
      icon: Users
    },
    {
      title: "Smart Health Records",
      description: "Intelligent organization and insights from your medical data",
      icon: FileText
    },
    {
      title: "24/7 Emergency Support",
      description: "Round-the-clock medical support for urgent healthcare needs",
      icon: Phone
    },
    {
      title: "Preventive Care Alerts",
      description: "Automated reminders for checkups, vaccinations, and screenings",
      icon: Calendar
    }
  ];
  const stats = [{
    label: "Active Patients",
    value: "12,458",
    growth: "+15%"
  }, {
    label: "Expert Doctors",
    value: "245",
    growth: "+8%"
  }, {
    label: "Appointments Completed",
    value: "89,234",
    growth: "+22%"
  }, {
    label: "Patient Satisfaction",
    value: "98.5%",
    growth: "+2%"
  }];
  return <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            CATMS
          </div>
          <div className="flex gap-4">
            <Button onClick={() => setIsSignUpModalOpen(true)} variant="outline" className="shadow-button">
              Sign Up
            </Button>
            <Button onClick={() => setIsAuthModalOpen(true)} variant="outline" className="shadow-button">
              Admin Portal
            </Button>
            <Button onClick={() => setIsPatientLoginOpen(true)} className="bg-gradient-primary hover:opacity-90 shadow-button">
              Patient Login
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-90"></div>
        <div className="absolute inset-0 bg-cover bg-center opacity-20" style={{
        backgroundImage: `url(${heroImage})`
      }}></div>
        <div className="relative container mx-auto px-6 py-24 text-center text-primary-foreground">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your Health, <span className="text-white">Our Priority</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
            CATMS - Clinic Appointment & Treatment Management System provides seamless healthcare management 
            for patients, doctors, and medical staff.
          </p>
          <div className="flex justify-center">
            <Button size="lg" onClick={() => setIsSignUpModalOpen(true)} className="bg-white text-primary hover:bg-white/90 shadow-hero">
              Get Started Today
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose CATMS Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose CATMS?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience healthcare management like never before with our comprehensive platform
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 group cursor-pointer" onClick={() => setExpandedBenefit(expandedBenefit === index ? null : index)}>
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground mb-3">{benefit.description}</p>
                  {expandedBenefit === index && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-sm text-foreground">{benefit.expandedDescription}</p>
                    </div>
                  )}
                  <div className="flex justify-center mt-3">
                    {expandedBenefit === index ? <ChevronUp className="w-4 h-4 text-primary" /> : <ChevronDown className="w-4 h-4 text-primary" />}
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Meet Our Expert Doctors */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Meet Our Expert Doctors</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our team of experienced healthcare professionals is here to provide you with the best medical care
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {(showAllDoctors ? doctors : doctors.slice(0, 3)).map((doctor, index) => <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="relative">
                  <img src={doctor.image} alt={doctor.name} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-success text-success-foreground">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {doctor.rating}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
                  <p className="text-primary font-medium mb-3">{doctor.specialization}</p>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">{doctor.availability}</span>
                  </div>
                </CardContent>
              </Card>)}
          </div>
          {doctors.length > 3 && (
            <div className="text-center mt-8">
              <Button 
                variant="outline" 
                onClick={() => setShowAllDoctors(!showAllDoctors)}
                className="shadow-button"
              >
                {showAllDoctors ? (
                  <>Show Less <ChevronUp className="w-4 h-4 ml-2" /></>
                ) : (
                  <>View All Doctors <ChevronDown className="w-4 h-4 ml-2" /></>
                )}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Trending New Section */}
      <section className="py-20 bg-gradient-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-primary text-primary-foreground">Trending Now</Badge>
            <h2 className="text-4xl font-bold mb-4">Latest Healthcare Innovations</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the newest features and improvements we've added to enhance your healthcare experience
            </p>
          </div>
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex-1"></div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentNewsIndex(Math.max(0, currentNewsIndex - 1))}
                  disabled={currentNewsIndex === 0}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentNewsIndex(Math.min(newsItems.length - 3, currentNewsIndex + 1))}
                  disabled={currentNewsIndex >= newsItems.length - 3}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {newsItems.slice(currentNewsIndex, currentNewsIndex + 3).map((news, index) => (
                <Card key={currentNewsIndex + index} className="shadow-card hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <news.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{news.title}</h3>
                    <p className="text-muted-foreground">{news.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">CATMS by the Numbers</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied patients and healthcare professionals
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground mb-2">{stat.label}</div>
                  <div className="flex items-center justify-center text-success">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{stat.growth}</span>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">CATMS</h3>
              <p className="opacity-90 mb-4">
                Revolutionizing healthcare management with innovative technology and compassionate care.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 opacity-90">
                <li>About Us</li>
                <li>Services</li>
                <li>Doctors</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 opacity-90">
                <li>Appointment Booking</li>
                <li>Online Consultations</li>
                <li>Lab Reports</li>
                <li>Health Records</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact Info</h4>
              <div className="space-y-2 opacity-90">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  <a 
                    href="https://maps.google.com/?q=123+Medical+Center+Dr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center hover:text-white/80 transition-colors"
                  >
                    123 Medical Center Dr.
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <a 
                    href="tel:+15551234567" 
                    className="hover:text-white/80 transition-colors"
                  >
                    +1 (555) 123-4567
                  </a>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <a 
                    href="mailto:info@catms.com" 
                    className="hover:text-white/80 transition-colors"
                  >
                    info@catms.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8">
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="grid grid-cols-2 gap-2 opacity-90">
                  <a href="#" className="hover:text-white/80 transition-colors">Patient Portal</a>
                  <a href="#" className="hover:text-white/80 transition-colors">Doctor Login</a>
                  <a href="#" className="hover:text-white/80 transition-colors">Admin Portal</a>
                  <a href="#" className="hover:text-white/80 transition-colors">Staff Login</a>
                  <a href="#" className="hover:text-white/80 transition-colors">Appointment Booking</a>
                  <a href="#" className="hover:text-white/80 transition-colors">Lab Reports</a>
                  <a href="#" className="hover:text-white/80 transition-colors">Billing & Insurance</a>
                  <a href="#" className="hover:text-white/80 transition-colors">Emergency Contact</a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <div className="space-y-2 opacity-90">
                  <a href="#" className="block hover:text-white/80 transition-colors">Help Center</a>
                  <a href="#" className="block hover:text-white/80 transition-colors">FAQ</a>
                  <a href="#" className="block hover:text-white/80 transition-colors">Privacy Policy</a>
                  <a href="#" className="block hover:text-white/80 transition-colors">Terms of Service</a>
                </div>
              </div>
            </div>
            <div className="text-center opacity-90">
              <p>&copy; 2024 CATMS. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen} />
      <SignUpModal open={isSignUpModalOpen} onOpenChange={setIsSignUpModalOpen} />
      <PatientLoginModal open={isPatientLoginOpen} onOpenChange={setIsPatientLoginOpen} />
    </div>;
};
export default LandingPage;