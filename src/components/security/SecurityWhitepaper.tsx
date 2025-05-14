
import React from "react";
import { Button } from "@/components/ui/button";
import { BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SecurityWhitepaperProps {
  isAuthenticated: boolean | null;
}

const SecurityWhitepaper: React.FC<SecurityWhitepaperProps> = ({ isAuthenticated }) => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-blue-600 text-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Download Our Security Whitepaper</h2>
          <p className="text-xl mb-8">
            Get detailed information about our security practices, infrastructure, and compliance measures.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button className="bg-white text-blue-600 hover:bg-gray-100">
              Download Whitepaper
            </Button>
            
            {isAuthenticated && (
              <Button 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
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

export default SecurityWhitepaper;
