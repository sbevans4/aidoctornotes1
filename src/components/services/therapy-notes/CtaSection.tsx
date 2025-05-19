
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const CtaSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Therapy Practice?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of mental health professionals saving hours every day with ConvoNotes Genius
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button 
            size="lg"
            onClick={() => navigate("/subscription-plans")}
            className="bg-white text-blue-600 hover:bg-gray-100"
          >
            Start Free 14-Day Trial
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => navigate("/contact")}
            className="text-white border-white hover:bg-white/10"
          >
            Contact for Enterprise
          </Button>
        </div>
      </div>
    </section>
  );
};
