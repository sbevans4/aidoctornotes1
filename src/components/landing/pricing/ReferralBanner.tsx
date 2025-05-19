
import React from "react";
import { Percent } from "lucide-react";

interface ReferralBannerProps {
  discount?: number;
  expiryDate?: string;
}

export const ReferralBanner: React.FC<ReferralBannerProps> = ({ discount, expiryDate }) => {
  if (!discount) return null;
  
  // Format expiry date if provided
  const formattedExpiryDate = expiryDate 
    ? new Date(expiryDate).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : null;

  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6 animate-fade-in" role="alert">
      <div className="flex flex-col sm:flex-row items-start sm:items-center">
        <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Percent className="h-5 w-5 text-green-600" aria-hidden="true" />
          </div>
        </div>
        <div>
          <p className="font-medium text-green-800">Special Discount Applied!</p>
          <p className="text-sm text-green-700">
            Your referral code gives you {discount}% off any plan. This discount will be automatically applied at checkout
            {formattedExpiryDate && ` (valid until ${formattedExpiryDate})`}.
          </p>
        </div>
      </div>
    </div>
  );
};
