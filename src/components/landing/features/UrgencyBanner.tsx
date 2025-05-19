
import React, { useState } from "react";
import { AlertCircle, Clock, X } from "lucide-react";

export const UrgencyBanner = () => {
  const [show, setShow] = useState(true);
  
  if (!show) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 relative">
      <button 
        onClick={() => setShow(false)} 
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
        aria-label="Close banner"
      >
        <X className="h-4 w-4" />
      </button>
      
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          <Clock className="h-5 w-5 text-amber-500" />
        </div>
        <div>
          <p className="font-medium text-amber-800">Limited Time Offer</p>
          <p className="text-sm text-amber-700">
            Sign up for the Professional plan and get 2 months free. Offer ends in 7 days.
          </p>
          <div className="mt-2">
            <div className="w-full bg-amber-200 rounded-full h-2.5">
              <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "30%" }}></div>
            </div>
            <p className="text-xs text-amber-700 mt-1">Over 70% of promotional spots already taken</p>
          </div>
        </div>
      </div>
    </div>
  );
};
