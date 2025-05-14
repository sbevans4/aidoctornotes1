
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Menu, X } from "lucide-react";
import { Logo } from "./navigation/Logo";
import { DesktopNavigation } from "./navigation/DesktopNavigation";
import { MobileNavigation } from "./navigation/MobileNavigation";

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
          <Logo textColor={textColor} />

          {/* Desktop Navigation */}
          <DesktopNavigation 
            textColor={textColor}
            buttonVariant={buttonVariant}
            session={session}
            handleLogin={handleLogin}
            handleLogout={handleLogout}
          />

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
      <MobileNavigation 
        isMenuOpen={isMenuOpen}
        session={session}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
      />
    </nav>
  );
};
