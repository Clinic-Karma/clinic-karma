import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Shield, Users, Award, Clock, MapPin } from 'lucide-react';

interface AboutUsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutUsModal = ({ open, onOpenChange }: AboutUsModalProps) => {
  const values = [
    {
      icon: Heart,
      title: "Compassionate Care",
      description: "We believe in treating every patient with empathy, respect, and dignity."
    },
    {
      icon: Shield,
      title: "Excellence in Medicine",
      description: "Our commitment to the highest standards of medical practice and patient safety."
    },
    {
      icon: Users,
      title: "Patient-Centered Approach",
      description: "Your health journey is unique, and we tailor our care to your individual needs."
    },
    {
      icon: Award,
      title: "Innovation & Technology",
      description: "Leveraging cutting-edge technology to enhance patient care and outcomes."
    }
  ];

  const achievements = [
    { metric: "15+", label: "Years of Excellence" },
    { metric: "50,000+", label: "Patients Served" },
    { metric: "245+", label: "Medical Professionals" },
    { metric: "98.5%", label: "Patient Satisfaction" }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl text-center mb-6">About MedSync</DialogTitle>
        </DialogHeader>

        <div className="space-y-8">
          {/* Mission Statement */}
          <div className="text-center space-y-4">
            <Badge className="bg-gradient-primary text-primary-foreground px-4 py-2">Our Mission</Badge>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              At MedSync, we are committed to revolutionizing healthcare delivery through innovative technology, 
              compassionate care, and a patient-centered approach. Our mission is to make quality healthcare 
              accessible, efficient, and personalized for every individual we serve.
            </p>
          </div>

          {/* Our Values */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-6">Our Core Values</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <Card key={index} className="shadow-card hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-primary w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">{value.title}</h4>
                        <p className="text-muted-foreground">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-subtle rounded-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-6">Our Achievements</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {achievements.map((achievement, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">{achievement.metric}</div>
                  <div className="text-muted-foreground">{achievement.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Leadership */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-6">Leadership Team</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-card text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">JD</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Dr. Jane Davis</h4>
                  <p className="text-muted-foreground mb-2">Chief Medical Officer</p>
                  <p className="text-sm text-muted-foreground">
                    With over 20 years of experience in healthcare management and clinical excellence.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">MS</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Michael Smith</h4>
                  <p className="text-muted-foreground mb-2">Chief Technology Officer</p>
                  <p className="text-sm text-muted-foreground">
                    Leading healthcare technology innovation with 15+ years in digital health solutions.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card text-center">
                <CardContent className="p-6">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">AJ</span>
                  </div>
                  <h4 className="text-lg font-semibold mb-2">Dr. Anna Johnson</h4>
                  <p className="text-muted-foreground mb-2">Director of Patient Care</p>
                  <p className="text-sm text-muted-foreground">
                    Dedicated to ensuring exceptional patient experiences and clinical outcomes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-muted/30 rounded-lg p-6">
            <h3 className="text-xl font-bold text-center mb-4">Get in Touch</h3>
            <div className="grid md:grid-cols-2 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Visit Us</p>
                  <p className="text-sm text-muted-foreground">123 Medical Center Dr.</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">Office Hours</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 8AM-6PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutUsModal;