import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, CreditCard, History, Users, TrendingUp, Star, MapPin, Phone, Mail, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, ExternalLink, Heart, Activity } from 'lucide-react';
import SignUpModal from './SignUpModal';
import LoginModal from './LoginModal';
import AboutUsModal from './AboutUsModal';
import BranchDetailsModal from './BranchDetailsModal';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import heroImage from '@/assets/medical-hero.jpg';
import doctor1 from '@/assets/doctor-1.jpg';
import doctor2 from '@/assets/doctor-2.jpg';
import doctor3 from '@/assets/doctor-3.jpg';
import doctor4 from '@/assets/doctor-4.png';
import doctor5 from '@/assets/doctor-5.png';
import doctor6 from '@/assets/doctor-6.png';

const LandingPage = () => {
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isBranchDetailsOpen, setIsBranchDetailsOpen] = useState(false);
  const [showAllDoctors, setShowAllDoctors] = useState(false);
  
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleDashboardRedirect = () => {
    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    switch (user?.role) {
      case 'patient':
        navigate('/patient-dashboard');
        break;
      case 'doctor':
        navigate('/doctor-dashboard');
        break;
      case 'top-manager':
        navigate('/top-manager');
        break;
      case 'branch-manager':
        navigate('/branch-manager');
        break;
      case 'lab-coordinator':
        navigate('/lab-coordinator');
        break;
      case 'receptionist':
        navigate('/receptionist');
        break;
      default:
        navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  const benefits = [{
    icon: Calendar,
    title: "⚡ Lightning-Fast Booking",
    description: "Book appointments with your preferred doctors in just a few clicks - no more waiting on hold!"
  }, {
    icon: FileText,
    title: "📋 Your Complete Health Story",
    description: "Access all your medical records, prescriptions, and treatment history in one secure, beautiful dashboard"
  }, {
    icon: CreditCard,
    title: "💰 Zero-Hassle Billing",
    description: "Crystal-clear billing with smart insurance integration - know exactly what you'll pay before you visit"
  }, {
    icon: History,
    title: "🔬 Smart Lab & Reports Hub",
    description: "Digital access to all your lab reports with AI-powered insights and trend analysis"
  }];
  const doctors = [{
    name: "Dr. Nuwan Perera",
    specialization: "General Physician",
    image: doctor4,
    availability: "Mon-Fri 9AM-5PM",
    rating: 4.9
  }, {
    name: "Dr.Kavindi Silva",
    specialization: "Dermatologist",
    image: doctor2,
    availability: "Tue-Sat 10AM-6PM",
    rating: 4.8
  }, {
    name: "Dr. Carlos Rodriguez",
    specialization: "Cardiologist",
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
    specialization: "Orthopedic Surgeon",
    image: doctor5,
    availability: "Wed-Sun 9AM-5PM",
    rating: 4.7
  }, {
    name: "Dr. Maria Lopez",
    specialization: "Neurologist",
    image: doctor6,
    availability: "Mon-Fri 10AM-4PM",
    rating: 4.8
  }];

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
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-7 h-7 text-white fill-current" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <Activity className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              MedSync
            </div>
          </div>
          <div className="hidden md:flex gap-4">
            {isAuthenticated ? (
              <>
                <Button onClick={handleDashboardRedirect} variant="outline" className="shadow-button">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} className="bg-gradient-primary hover:opacity-90 shadow-button">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsSignUpModalOpen(true)} variant="outline" className="shadow-button">
                  Sign Up
                </Button>
                <Button onClick={() => setIsLoginOpen(true)} className="bg-gradient-primary hover:opacity-90 shadow-button">
                 Login
                </Button>
              </>
            )}
          </div>
          {/* Mobile Menu */}
          <div className="md:hidden flex gap-1">
            {isAuthenticated ? (
              <>
                <Button onClick={handleDashboardRedirect} size="sm" variant="outline" className="shadow-button text-xs px-2">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} size="sm" className="bg-gradient-primary hover:opacity-90 shadow-button text-xs px-2">
                 Logout
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => setIsSignUpModalOpen(true)} size="sm" variant="outline" className="shadow-button text-xs px-2">
                  Sign Up
                </Button>
                <Button onClick={() => setIsLoginOpen(true)} size="sm" className="bg-gradient-primary hover:opacity-90 shadow-button text-xs px-2">
                 Login
                </Button>
              </>
            )}
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
            MedSync provides seamless healthcare management 
            for patients, doctors, and medical staff with modern technology.
          </p>
          <div className="flex justify-center">
            <Button size="lg" onClick={isAuthenticated ? handleDashboardRedirect : () => setIsSignUpModalOpen(true)} className="bg-white text-primary hover:bg-white/90 shadow-hero">
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started Today'}
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose MedSync Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              Trusted by 50,000+ Patients
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Why Choose MedSync?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your healthcare experience with our cutting-edge platform that puts <span className="font-semibold text-blue-600">you</span> at the center of everything. 
              <br />Experience healthcare management like never before with intelligent features designed for modern life.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => <Card key={index} className="relative bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 group overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="mb-6">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg">
                      <benefit.icon className="w-10 h-10 text-white" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-base">{benefit.description}</p>
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {(showAllDoctors ? doctors : doctors.slice(0, 3)).map((doctor, index) => <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                  <img src={doctor.image} alt={doctor.name} className="w-full max-w-xs h-72 sm:h-80 object-contain object-center group-hover:scale-105 transition-transform duration-300 rounded-lg" />
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


      {/* Statistics Section */}
      <section className="py-20 bg-gradient-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">MedSync by the Numbers</h2>
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
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
                    <Heart className="w-6 h-6 text-white fill-current" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                    <Activity className="w-2 h-2 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">MedSync</h3>
              </div>
              <p className="opacity-90 mb-4">
                Revolutionizing healthcare management with innovative technology and compassionate care.
              </p>
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
                    href="mailto:info@medsync.com" 
                    className="hover:text-white/80 transition-colors"
                  >
                    info@medsync.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center opacity-90">
              <p>&copy; 2024 MedSync. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SignUpModal open={isSignUpModalOpen} onOpenChange={setIsSignUpModalOpen} onOpenLogin={() => setIsLoginOpen(true)}/>
      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
      <AboutUsModal open={isAboutUsOpen} onOpenChange={setIsAboutUsOpen} />
      <BranchDetailsModal open={isBranchDetailsOpen} onOpenChange={setIsBranchDetailsOpen} />
    </div>;
};
export default LandingPage;