
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Shield, Clock, Award } from "lucide-react";

interface HeroSectionProps {
  handleLogin: () => Promise<void>;
}

export const HeroSection = ({ handleLogin: _ }: HeroSectionProps) => {
  const navigate = useNavigate();

  return (
    <header className="bg-medical-primary text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Medical Transcription Made Simple
          </h1>
          <p className="text-xl mb-8">
            Transform your medical conversations into accurate, structured clinical notes with AI-powered transcription
          </p>
          <div className="space-x-4 mb-12">
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-medical-primary hover:bg-gray-100"
            >
              Get Started Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate("/medical-documentation")}
              className="text-white border-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </div>
          
          <div className="relative w-full max-w-2xl mx-auto mb-12 rounded-lg overflow-hidden shadow-xl">
            <img 
              src="/placeholder.svg" 
              alt="Record → Summarize → SOAP Workflow"
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-medical-primary/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-center">
            <div className="flex flex-col items-center">
              <Shield className="w-12 h-12 mb-4 text-medical-light" />
              <h3 className="text-lg font-semibold mb-2">HIPAA-Compliant</h3>
              <p className="text-sm text-medical-light">Secure & Private</p>
            </div>
            <div className="flex flex-col items-center">
              <Award className="w-12 h-12 mb-4 text-medical-light" />
              <h3 className="text-lg font-semibold mb-2">500+ Clinicians</h3>
              <p className="text-sm text-medical-light">Trust Our Platform</p>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-12 h-12 mb-4 text-medical-light" />
              <h3 className="text-lg font-semibold mb-2">99.9% Uptime</h3>
              <p className="text-sm text-medical-light">Always Available</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
