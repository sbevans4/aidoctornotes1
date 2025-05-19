
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CtaSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-blue-600 text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Save Hours on Documentation?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of healthcare professionals already using AIDoctorNotes to reduce their documentation burden
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Start Free 14-Day Trial
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate("/enterprise")}
            className="text-white border-white hover:bg-white/10"
          >
            Schedule a Demo
          </Button>
        </div>
      </div>
    </section>
  );
};
