
import React from "react";
import { NavLink } from "@/components/ui/nav-link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface MobileNavigationProps {
  isMenuOpen: boolean;
  session: any;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({
  isMenuOpen,
  session,
  handleLogin,
  handleLogout,
}) => {
  if (!isMenuOpen) return null;
  
  return (
    <div className="md:hidden">
      <div className="px-6 py-4 space-y-3 bg-white border-b border-gray-200 shadow-lg">
        <NavLink 
          to="/" 
          className="block py-2 text-gray-900 hover:text-primary" 
          activeClassName="text-primary font-medium"
          end
        >
          Home
        </NavLink>
        
        <NavLink 
          to="/blog" 
          className="block py-2 text-gray-900 hover:text-primary" 
          activeClassName="text-primary font-medium"
        >
          Blog
        </NavLink>
        
        <NavLink 
          to="/enterprise" 
          className="block py-2 text-gray-900 hover:text-primary"
          activeClassName="text-primary font-medium"
        >
          Enterprise
        </NavLink>
        
        <NavLink 
          to="/contact" 
          className="block py-2 text-gray-900 hover:text-primary"
          activeClassName="text-primary font-medium" 
        >
          Contact
        </NavLink>
        
        {session ? (
          <>
            <Separator />
            
            <NavLink 
              to="/dashboard" 
              className="block py-2 text-gray-900 hover:text-primary"
              activeClassName="text-primary font-medium"
            >
              Dashboard
            </NavLink>
            
            <NavLink 
              to="/medical-documentation" 
              className="block py-2 text-gray-900 hover:text-primary"
              activeClassName="text-primary font-medium"
            >
              Medical Documentation
            </NavLink>
            
            <NavLink 
              to="/document-history" 
              className="block py-2 text-gray-900 hover:text-primary"
              activeClassName="text-primary font-medium"
            >
              Document History
            </NavLink>
            
            <NavLink 
              to="/profile" 
              className="block py-2 text-gray-900 hover:text-primary"
              activeClassName="text-primary font-medium"
            >
              Profile
            </NavLink>
            
            <NavLink 
              to="/settings" 
              className="block py-2 text-gray-900 hover:text-primary"
              activeClassName="text-primary font-medium"
            >
              Settings
            </NavLink>
            
            <Button onClick={handleLogout} variant="outline" className="w-full mt-2">
              Logout
            </Button>
          </>
        ) : (
          <Button onClick={handleLogin} className="w-full mt-2">
            Sign In
          </Button>
        )}
      </div>
    </div>
  );
};
