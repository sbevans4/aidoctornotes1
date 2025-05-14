import React from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserCircle,
  LayoutDashboard,
  FileText,
  CreditCard,
  LogOut,
  User,
  LogIn,
} from "lucide-react";

interface DesktopNavigationProps {
  textColor: string;
  buttonVariant: "default" | "outline" | "outlineWhite";
  session: any;
  handleLogin: () => Promise<void>;
  handleLogout: () => Promise<void>;
}

export const DesktopNavigation = ({
  textColor,
  buttonVariant,
  session,
  handleLogin,
  handleLogout,
}: DesktopNavigationProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  return (
    <div className="hidden md:flex items-center gap-6">
      <nav className="flex gap-6">
        <NavLink to="/" className={`${textColor} hover:opacity-80`}>
          Home
        </NavLink>
        <NavLink to="/services" className={`${textColor} hover:opacity-80`}>
          Services
        </NavLink>
        <NavLink to="/blog" className={`${textColor} hover:opacity-80`}>
          Blog
        </NavLink>
        <NavLink to="/contact" className={`${textColor} hover:opacity-80`}>
          Contact
        </NavLink>
        <NavLink to="/security" className={`${textColor} hover:opacity-80`}>
          Security
        </NavLink>
      </nav>

      <div className="flex items-center gap-3">
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className={textColor}>
                <UserCircle className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/medical-documentation')}>
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/subscription-plans')}>
                <CreditCard className="mr-2 h-4 w-4" />
                Subscription
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant={buttonVariant} onClick={handleLogin}>
            Sign in
          </Button>
        )}
      </div>
    </div>
  );
};
