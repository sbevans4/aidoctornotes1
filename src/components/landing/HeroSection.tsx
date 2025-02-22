
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, Award, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  handleLogin: () => Promise<void>;
}

export const HeroSection = ({ handleLogin: _ }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <header className="relative overflow-hidden bg-medical-primary text-white">
      <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-10" />
      <div className="container relative mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Transform Your Medical Documentation
          </h1>
          <p className="text-xl md:text-2xl mb-10 text-medical-light leading-relaxed">
            Intelligent AI-powered transcription that converts medical conversations into 
            accurate, structured clinical notes in real-time
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="w-full sm:w-auto bg-white text-medical-primary hover:bg-gray-100 font-semibold px-8"
            >
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/medical-documentation")}
              className="w-full sm:w-auto text-white border-white hover:bg-white/10"
            >
              See How It Works
            </Button>
          </div>
          
          <div className="relative w-full max-w-3xl mx-auto mb-16 rounded-xl overflow-hidden shadow-2xl">
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
              <p className="text-medical-light">Enterprise-grade security and privacy</p>
            </div>
            <div className="flex flex-col items-center p-6 backdrop-blur-sm bg-white/5 rounded-lg">
              <Award className="w-12 h-12 mb-4 text-medical-light" />
              <h3 className="text-xl font-semibold mb-2">500+ Clinicians</h3>
              <p className="text-medical-light">Trust our platform daily</p>
            </div>
            <div className="flex flex-col items-center p-6 backdrop-blur-sm bg-white/5 rounded-lg">
              <Clock className="w-12 h-12 mb-4 text-medical-light" />
              <h3 className="text-xl font-semibold mb-2">Save 2+ Hours</h3>
              <p className="text-medical-light">Per day on documentation</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
