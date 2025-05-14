
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface MobileNavigationProps {
  isMenuOpen: boolean;
  session: any;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const MobileNavigation = ({
  isMenuOpen,
  session,
  handleLogin,
  handleLogout
}: MobileNavigationProps) => {
  const navigate = useNavigate();

  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden bg-white border-t shadow-lg">
      <div className="container mx-auto px-4 py-4 space-y-2">
        <button 
          className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 rounded"
          onClick={() => navigate("/services/ai-doctor-notes")}
        >
          AI Doctor Notes
        </button>
        <button 
          className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 rounded"
          onClick={() => navigate("/services/ai-therapy-notes")}
        >
          AI Therapy Notes
        </button>
        <button 
          className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 rounded"
          onClick={() => navigate("/services/ai-medical-transcription")}
        >
          AI Medical Transcription
        </button>
        <button 
          className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 rounded"
          onClick={() => navigate("/security")}
        >
          Security
        </button>
        <button 
          className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 rounded"
          onClick={() => navigate("/blog")}
        >
          Blog
        </button>
        <button 
          className="flex items-center justify-between w-full px-2 py-3 hover:bg-gray-100 rounded"
          onClick={() => navigate("/contact")}
        >
          Contact
        </button>

        <div className="pt-4 border-t">
          {session ? (
            <>
              <button
                className="w-full px-2 py-3 mb-2 hover:bg-gray-100 rounded text-left"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </button>
              <button
                className="w-full px-2 py-3 mb-2 hover:bg-gray-100 rounded text-left"
                onClick={() => navigate("/medical-documentation")}
              >
                Documentation
              </button>
              <button
                className="w-full px-2 py-3 mb-2 hover:bg-gray-100 rounded text-left"
                onClick={() => navigate("/subscription-plans")}
              >
                Subscription
              </button>
              <Button 
                onClick={handleLogout} 
                className="w-full justify-center"
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleLogin}
                className="w-full justify-center mb-2"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/auth?action=signup")}
                className="w-full justify-center bg-medical-primary hover:bg-medical-primary/90"
              >
                Get Started
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
