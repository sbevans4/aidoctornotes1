
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Menu, X, ChevronDown } from "lucide-react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check authentication status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Detect scroll for styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogin = async () => {
    try {
      navigate("/auth");
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${
    isScrolled || isMenuOpen ? "bg-white shadow-md" : "bg-transparent"
  }`;

  const textColor = (!isScrolled && !isMenuOpen && location.pathname === "/") 
    ? "text-white" 
    : "text-gray-900";

  const buttonVariant = (!isScrolled && !isMenuOpen && location.pathname === "/") 
    ? "outlineWhite" 
    : "outline";

  return (
    <nav className={navClasses}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className={`text-2xl font-bold ${textColor}`}>
              ConvoNotes <span className="text-medical-primary">Genius</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
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
                <Link 
                  to="/medical-documentation" 
                  className={`hover:text-medical-primary ${textColor}`}
                >
                  Dashboard
                </Link>
                <Button onClick={handleLogout}>Sign Out</Button>
              </>
            ) : (
              <>
                <Button 
                  variant={buttonVariant as any} 
                  onClick={handleLogin}
                >
                  Sign In
                </Button>
                <Button 
                  className={location.pathname === "/" ? "" : "bg-medical-primary hover:bg-medical-primary/90"}
                  onClick={() => navigate("/auth?action=signup")}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`p-2 focus:outline-none ${textColor}`}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
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
                    className="w-full px-2 py-3 mb-2 hover:bg-gray-100 rounded"
                    onClick={() => navigate("/medical-documentation")}
                  >
                    Dashboard
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
      )}
    </nav>
  );
};
