
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, Award, ArrowRight, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface HeroSectionProps {
  handleLogin: () => Promise<void>;
}

export const HeroSection = ({ handleLogin }: HeroSectionProps) => {
  const navigate = useNavigate();

  const handleDemoBooking = () => {
    toast({
      title: "Demo Booking",
      description: "Our team will contact you shortly to schedule your demo.",
    });
  };

  return (
    <header className="relative overflow-hidden bg-medical-primary text-white">
      <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-10" />
      <div className="container relative mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/20 bg-white/10 text-sm font-medium mb-6">
            <Shield className="h-4 w-4 text-green-300" />
            <span>HIPAA-Compliant</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            AI Doctor Notes to <span className="text-green-300">Save You Hours</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-medical-light leading-relaxed">
            Intelligent AI-powered transcription that converts medical conversations into 
            accurate, structured clinical notes in real-time
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto bg-white text-medical-primary hover:bg-gray-100 font-semibold px-8"
            >
              Start Free 14-Day Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleDemoBooking}
              className="w-full sm:w-auto text-white border-white hover:bg-white/10"
            >
              Book a Demo
            </Button>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-300" />
              <span className="text-sm">No Credit Card Required</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-300" />
              <span className="text-sm">Epic & Cerner Integration</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-300" />
              <span className="text-sm">100% Money Back Guarantee</span>
            </div>
          </div>
          
          <div className="relative w-full max-w-3xl mx-auto mb-12 rounded-xl overflow-hidden shadow-2xl">
            <video 
              className="w-full h-auto"
              autoPlay
              muted
              loop
              playsInline
              poster="/demo-poster.jpg"
            >
              <source src="/workflow-demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-medical-primary/20 to-transparent pointer-events-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center p-6 backdrop-blur-sm bg-white/5 rounded-lg">
              <Shield className="w-12 h-12 mb-4 text-medical-light" />
              <h3 className="text-xl font-semibold mb-2">HIPAA-Compliant</h3>
              <p className="text-medical-light">End-to-end encryption with BAA available</p>
            </div>
            <div className="flex flex-col items-center p-6 backdrop-blur-sm bg-white/5 rounded-lg">
              <Award className="w-12 h-12 mb-4 text-medical-light" />
              <h3 className="text-xl font-semibold mb-2">Trusted by 500+</h3>
              <p className="text-medical-light">Healthcare professionals daily</p>
            </div>
            <div className="flex flex-col items-center p-6 backdrop-blur-sm bg-white/5 rounded-lg">
              <Clock className="w-12 h-12 mb-4 text-medical-light" />
              <h3 className="text-xl font-semibold mb-2">Save 2+ Hours</h3>
              <p className="text-medical-light">Per day on documentation</p>
            </div>
          </div>
          
          {/* Trusted By Section */}
          <div className="mt-16">
            <p className="text-sm uppercase tracking-wider text-medical-light/70 mb-6">Trusted By Healthcare Providers</p>
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
              <div className="h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="/epic-logo.svg" alt="Epic Systems" className="h-full w-auto" />
              </div>
              <div className="h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="/cerner-logo.svg" alt="Cerner" className="h-full w-auto" />
              </div>
              <div className="h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="/allscripts-logo.svg" alt="Allscripts" className="h-full w-auto" />
              </div>
              <div className="h-8 opacity-70 hover:opacity-100 transition-opacity">
                <img src="/nextgen-logo.svg" alt="NextGen Healthcare" className="h-full w-auto" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
