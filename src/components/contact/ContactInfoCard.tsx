
import React from "react";
import { LucideIcon } from "lucide-react";

interface ContactInfoCardProps {
  icon: LucideIcon;
  title: string;
  details: string[];
}

export const ContactInfoCard = ({ icon: Icon, title, details }: ContactInfoCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm text-center">
      <div className="flex justify-center mb-4">
        <div className="p-3 rounded-full bg-blue-100">
          <Icon className="h-6 w-6 text-blue-600" />
        </div>
      </div>
      <h3 className="font-bold mb-3">{title}</h3>
      {details.map((detail, idx) => (
        <p key={idx} className="text-gray-600">{detail}</p>
      ))}
    </div>
  );
};
