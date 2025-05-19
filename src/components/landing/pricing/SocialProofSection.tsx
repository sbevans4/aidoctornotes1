
import React from "react";

interface SocialProofNumbersProps {
  doctors: string;
  notes: string;
  saved: string;
  satisfaction: string;
}

export const SocialProofSection = ({ 
  doctors, 
  notes, 
  saved, 
  satisfaction 
}: SocialProofNumbersProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
      <div className="text-center p-4">
        <p className="text-3xl font-bold text-primary">{doctors}</p>
        <p className="text-sm text-gray-600">Doctors Trust Us</p>
      </div>
      <div className="text-center p-4">
        <p className="text-3xl font-bold text-primary">{notes}</p>
        <p className="text-sm text-gray-600">Notes Generated</p>
      </div>
      <div className="text-center p-4">
        <p className="text-3xl font-bold text-primary">{saved}</p>
        <p className="text-sm text-gray-600">Saved Daily</p>
      </div>
      <div className="text-center p-4">
        <p className="text-3xl font-bold text-primary">{satisfaction}</p>
        <p className="text-sm text-gray-600">Satisfaction Rate</p>
      </div>
    </div>
  );
};
