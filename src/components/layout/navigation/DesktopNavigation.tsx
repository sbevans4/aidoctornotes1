
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, ChevronDown, Users } from "lucide-react";

export const DesktopNavigation = ({ 
  textColor, 
  buttonVariant, 
  session, 
  handleLogin, 
  handleLogout 
}: { 
  textColor: string;
  buttonVariant: string;
  session: any;
  handleLogin: () => void;
  handleLogout: () => void;
}) => {
  return (
    <div className="hidden md:flex items-center space-x-6">
      <NavLink
        to="/services"
        className={({ isActive }) =>
          `font-medium ${textColor} hover:text-primary ${
            isActive ? "text-primary" : ""
          }`
        }
      >
        Services
      </NavLink>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className={`font-medium ${textColor} hover:text-primary flex items-center`}>
            Resources <ChevronDown className="ml-1 h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem asChild>
            <Link to="/services/doctor-notes">Doctor Notes</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/services/therapy-notes">Therapy Notes</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/services/transcription">Transcription</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/contact">Contact Us</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {session ? (
        <>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `font-medium ${textColor} hover:text-primary ${
                isActive ? "text-primary" : ""
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to="/referrals"
            className={({ isActive }) =>
              `font-medium ${textColor} hover:text-primary flex items-center ${
                isActive ? "text-primary" : ""
              }`
            }
          >
            <Users className="mr-1 h-4 w-4" /> Referrals
          </NavLink>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`font-medium ${textColor} hover:text-primary flex items-center`}>
                <User className="mr-1 h-4 w-4" /> Account <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/subscription-plans">Subscription</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/referrals">Referral Program</Link>
              </DropdownMenuItem>
              {session?.user?.user_metadata?.is_admin && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Admin</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/referrals">Manage Referrals</Link>
                  </DropdownMenuItem>
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <>
          <Link to="/enterprise">
            <span className={`font-medium ${textColor} hover:text-primary`}>
              Enterprise
            </span>
          </Link>
          <Button onClick={handleLogin} variant={buttonVariant}>
            Login
          </Button>
        </>
      )}
    </div>
  );
};
