import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, CreditCard, History, Users, TrendingUp, Star, MapPin, Phone, Mail } from 'lucide-react';
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
  const benefits = [{
    icon: Calendar,
    title: "Easy Appointment Scheduling",
    description: "Book appointments with your preferred doctors in just a few clicks"
  }, {
    icon: FileText,
    title: "Centralized Patient Records",
    description: "Access all your medical records, prescriptions, and treatment history in one place"
  }, {
    icon: CreditCard,
    title: "Transparent Billing & Insurance",
    description: "Clear billing statements with insurance integration for hassle-free payments"
  }, {
    icon: History,
    title: "Lab Reports & Treatment History",
    description: "Digital access to all your lab reports and complete treatment history"
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
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => setIsSignUpModalOpen(true)} className="bg-white text-primary hover:bg-white/90 shadow-hero">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline" onClick={() => setIsPatientLoginOpen(true)} className="border-white text-blue-800 bg-slate-50">
              Login to Your Account
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
            {benefits.map((benefit, index) => <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6 text-center">
                  <div className="bg-gradient-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <benefit.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
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
            {doctors.map((doctor, index) => <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300 group overflow-hidden">
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
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Diagnostics</h3>
                <p className="text-muted-foreground">Advanced AI assistance for more accurate and faster diagnosis</p>
              </CardContent>
            </Card>
            <Card className="shadow-card hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Telemedicine Integration</h3>
                <p className="text-muted-foreground">Connect with your healthcare providers from anywhere</p>
              </CardContent>
            </Card>
            <Card className="shadow-card hover:shadow-lg transition-all duration-300 group">
              <CardContent className="p-6">
                <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart Health Records</h3>
                <p className="text-muted-foreground">Intelligent organization and insights from your medical data</p>
              </CardContent>
            </Card>
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
                  <span>123 Medical Center Dr.</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  <span>info@catms.com</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center opacity-90">
            <p>&copy; 2024 CATMS. All rights reserved.</p>
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