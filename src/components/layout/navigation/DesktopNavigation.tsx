
import React from "react";
import { NavLink } from "@/components/ui/nav-link";
import { Button } from "@/components/ui/button";

interface DesktopNavigationProps {
  textColor: string;
  buttonVariant: "outline" | "outlineWhite";
  session: any;
  handleLogin: () => void;
  handleLogout: () => void;
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({
  textColor,
  buttonVariant,
  session,
  handleLogin,
  handleLogout,
}) => {
  return (
    <div className="flex items-center space-x-6">
      {/* Main Navigation */}
      <NavLink to="/" className={`${textColor} hover:text-blue-600 font-medium`}>
        Home
      </NavLink>
      
      <NavLink to="/blog" className={`${textColor} hover:text-blue-600 font-medium`}>
        Blog
      </NavLink>

      <NavLink to="/enterprise" className={`${textColor} hover:text-blue-600 font-medium`}>
        Enterprise
      </NavLink>

      <NavLink to="/contact" className={`${textColor} hover:text-blue-600 font-medium`}>
        Contact
      </NavLink>

      {/* Authentication Buttons */}
      {session ? (
        <div className="flex items-center space-x-4">
          <NavLink
            to="/dashboard"
            className={`${textColor} hover:text-blue-600 font-medium`}
            activeClassName="text-blue-600"
          >
            Dashboard
          </NavLink>
          
          <Button
            variant={buttonVariant}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      ) : (
        <Button
          onClick={handleLogin}
          variant={buttonVariant}
        >
          Sign In
        </Button>
      )}
    </div>
  );
};
