import { Button } from "@/components/ui/button";

interface CTASectionProps {
  handleLogin: () => Promise<void>;
}

export const CTASection = ({ handleLogin }: CTASectionProps) => {
  return (
    <section className="py-16 bg-medical-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Transform Your Medical Documentation?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of healthcare professionals who are saving time and improving accuracy with our AI-powered transcription service
        </p>
        <Button
          size="lg"
          onClick={handleLogin}
          className="bg-white text-medical-primary hover:bg-gray-100"
        >
          Start Your Free Trial
        </Button>
      </div>
    </section>
  );
};