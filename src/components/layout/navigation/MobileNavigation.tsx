
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NavLink, Separator } from "@/components/ui/nav-link";
import { LayoutDashboard, User, FileText, CreditCard, LogOut, LogIn } from "lucide-react";

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
    <div className="md:hidden border-t">
      <div className="container px-4 py-3">
        <nav className="flex flex-col space-y-3">
          <NavLink 
            to="/" 
            className="py-2 hover:text-blue-600"
            end
          >
            Home
          </NavLink>
          <NavLink 
            to="/services" 
            className="py-2 hover:text-blue-600"
            end
          >
            Services
          </NavLink>
          <NavLink 
            to="/blog" 
            className="py-2 hover:text-blue-600"
          >
            Blog
          </NavLink>
          <NavLink 
            to="/contact" 
            className="py-2 hover:text-blue-600"
          >
            Contact
          </NavLink>
          <NavLink 
            to="/security" 
            className="py-2 hover:text-blue-600"
          >
            Security
          </NavLink>
          
          {session ? (
            <>
              <Separator />
              <NavLink 
                to="/dashboard" 
                className="py-2 hover:text-blue-600 flex items-center gap-2"
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </NavLink>
              <NavLink 
                to="/profile" 
                className="py-2 hover:text-blue-600 flex items-center gap-2"
              >
                <User className="h-4 w-4" /> Profile
              </NavLink>
              <NavLink 
                to="/medical-documentation" 
                className="py-2 hover:text-blue-600 flex items-center gap-2"
              >
                <FileText className="h-4 w-4" /> Documentation
              </NavLink>
              <NavLink 
                to="/subscription-plans" 
                className="py-2 hover:text-blue-600 flex items-center gap-2"
              >
                <CreditCard className="h-4 w-4" /> Subscription
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 py-2 text-left text-red-500 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" /> Log out
              </button>
            </>
          ) : (
            <>
              <Separator />
              <button
                onClick={handleLogin}
                className="flex items-center gap-2 py-2 text-blue-600 hover:text-blue-700"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};
