
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface CTASectionProps {
  handleLogin: () => Promise<void>;
}

export const CTASection = ({ handleLogin: _ }: CTASectionProps) => {
  const navigate = useNavigate();
  
  return (
    <section className="relative py-24 bg-medical-primary text-white overflow-hidden">
      <div className="absolute inset-0 bg-[url('/medical-pattern.svg')] opacity-10" />
      <div className="container relative mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Ready to Transform Your Medical Practice?
        </h2>
        <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-medical-light leading-relaxed">
          Join thousands of healthcare professionals who are saving time and improving accuracy 
          with our AI-powered transcription service
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="w-full sm:w-auto bg-white text-medical-primary hover:bg-gray-100 font-semibold px-8"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate("/enterprise")}
            className="w-full sm:w-auto text-white border-white hover:bg-white/10"
          >
            Contact Enterprise Sales
          </Button>
        </div>
      </div>
    </section>
  );
};
