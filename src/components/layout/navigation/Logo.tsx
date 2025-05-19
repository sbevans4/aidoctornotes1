
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  textColor: string;
}

export const Logo = ({ textColor }: LogoProps) => {
  return (
    <div className="flex items-center">
      <Link to="/" className={`text-2xl font-bold ${textColor}`}>
        AIDoctorNotes <span className="text-medical-primary">Genius</span>
      </Link>
    </div>
  );
};
