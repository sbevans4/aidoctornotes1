
import React from "react";
import { Link } from "react-router-dom";
import { User, Users } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const MobileNavigation = ({
  isMenuOpen,
  session,
  handleLogin,
  handleLogout,
}: {
  isMenuOpen: boolean;
  session: any;
  handleLogin: () => void;
  handleLogout: () => void;
}) => {
  if (!isMenuOpen) return null;

  return (
    <div className="md:hidden p-4 bg-white shadow-lg">
      <div className="flex flex-col space-y-3">
        <Link
          to="/services"
          className="px-3 py-2 rounded-md hover:bg-gray-100 font-medium"
        >
          Services
        </Link>
        
        <Separator />
        <div className="px-3 font-semibold text-sm text-gray-500">Resources</div>
        
        <Link
          to="/services/doctor-notes"
          className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          Doctor Notes
        </Link>
        <Link
          to="/services/therapy-notes"
          className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          Therapy Notes
        </Link>
        <Link
          to="/services/transcription"
          className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          Transcription
        </Link>
        <Link
          to="/contact"
          className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
        >
          Contact Us
        </Link>

        <Separator />

        {session ? (
          <>
            <Link
              to="/dashboard"
              className="px-3 py-2 rounded-md hover:bg-gray-100 font-medium"
            >
              Dashboard
            </Link>

            <Link
              to="/referrals"
              className="px-3 py-2 rounded-md hover:bg-gray-100 font-medium flex items-center"
            >
              <Users className="mr-2 h-4 w-4" /> Referral Program
            </Link>

            <Separator />
            <div className="px-3 font-semibold text-sm text-gray-500 flex items-center">
              <User className="mr-2 h-4 w-4" /> My Account
            </div>

            <Link
              to="/profile"
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              Profile
            </Link>
            <Link
              to="/subscription-plans"
              className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
            >
              Subscription
            </Link>
            
            {session?.user?.user_metadata?.is_admin && (
              <>
                <Separator />
                <div className="px-3 font-semibold text-sm text-gray-500">Admin</div>
                <Link
                  to="/admin/referrals"
                  className="px-3 py-2 rounded-md hover:bg-gray-100 text-gray-700"
                >
                  Manage Referrals
                </Link>
              </>
            )}
            
            <Separator />
            <button
              onClick={handleLogout}
              className="px-3 py-2 text-left rounded-md hover:bg-gray-100 text-red-600 font-medium"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link
              to="/enterprise"
              className="px-3 py-2 rounded-md hover:bg-gray-100 font-medium"
            >
              Enterprise
            </Link>
            <button
              onClick={handleLogin}
              className="mt-2 px-3 py-2 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
            >
              Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};
