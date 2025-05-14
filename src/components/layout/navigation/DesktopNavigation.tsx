
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User } from "lucide-react";

interface DesktopNavigationProps {
  textColor: string;
  buttonVariant: "outline" | "outlineWhite" | any;
  session: any;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const DesktopNavigation = ({
  textColor,
  buttonVariant,
  session,
  handleLogin,
  handleLogout
}: DesktopNavigationProps) => {
  const navigate = useNavigate();

  return (
    <div className="hidden md:flex items-center space-x-8">
      {/* Services Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button 
            className={`flex items-center gap-1 hover:text-medical-primary ${textColor}`}
          >
            Services <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white">
          <DropdownMenuItem asChild>
            <Link to="/services/ai-doctor-notes" className="cursor-pointer">
              AI Doctor Notes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/services/ai-therapy-notes" className="cursor-pointer">
              AI Therapy Notes
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/services/ai-medical-transcription" className="cursor-pointer">
              AI Medical Transcription
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Link 
        to="/security" 
        className={`hover:text-medical-primary ${textColor}`}
      >
        Security
      </Link>
      
      <Link 
        to="/blog" 
        className={`hover:text-medical-primary ${textColor}`}
      >
        Blog
      </Link>
      
      <Link 
        to="/contact" 
        className={`hover:text-medical-primary ${textColor}`}
      >
        Contact
      </Link>

      {session ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 hover:text-medical-primary ${textColor}`}
              >
                <User className="h-4 w-4" />
                Account
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer w-full">
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/medical-documentation" className="cursor-pointer w-full">
                  Documentation
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/subscription-plans" className="cursor-pointer w-full">
                  Subscription
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Button 
            variant={buttonVariant} 
            onClick={handleLogin}
          >
            Sign In
          </Button>
          <Button 
            className={buttonVariant !== "outline" ? "" : "bg-medical-primary hover:bg-medical-primary/90"}
            onClick={() => navigate("/auth?action=signup")}
          >
            Get Started
          </Button>
        </>
      )}
    </div>
  );
};
