import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface HeroSectionProps {
  handleLogin: () => Promise<void>;
}

export const HeroSection = ({ handleLogin }: HeroSectionProps) => {
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
          <div className="space-x-4">
            <Button
              size="lg"
              onClick={handleLogin}
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
              Learn More About Documentation
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};