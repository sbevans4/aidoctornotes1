
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              AI Doctor Notes: Automate Your Documentation
            </h1>
            <p className="text-xl mb-6">
              Transform patient conversations into accurate clinical documentation in seconds, saving you hours every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
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
              alt="AI Doctor Notes Interface" 
              className="w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
