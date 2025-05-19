
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Streamline Therapy Documentation with AI
            </h1>
            <p className="text-xl mb-6">
              Convert therapy sessions into comprehensive notes in seconds, saving you up to 8 hours weekly on documentation. Focus on what matters most - your clients.
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                <span>Save 8+ hours weekly</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <span>Mental Health-Specific AI</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/subscription-plans")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Start Free 14-Day Trial <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/medical-documentation")}
                className="text-white border-white hover:bg-white/10"
              >
                View Demo
              </Button>
            </div>
          </div>
          <div className="rounded-lg overflow-hidden shadow-xl">
            <img 
              src="/placeholder.svg" 
              alt="AI Therapy Notes Interface" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
