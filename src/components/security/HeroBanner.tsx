
import React from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BarChart2 } from "lucide-react";

interface HeroBannerProps {
  isAuthenticated: boolean | null;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  return (
    <section className="bg-blue-600 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Shield className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4">Security & Compliance</h1>
          <p className="text-xl mb-8">
            We protect your data with the same care that you protect your patients. 
            Our robust security infrastructure ensures HIPAA compliance and the highest standards of data protection.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
              onClick={() => navigate("/contact")}
            >
              Contact Our Security Team
            </Button>
            
            {isAuthenticated && (
              <Button 
                className="bg-white text-blue-600 hover:bg-blue-50"
                onClick={() => navigate("/security/dashboard")}
              >
                <BarChart2 className="mr-2 h-4 w-4" />
                View Security Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
