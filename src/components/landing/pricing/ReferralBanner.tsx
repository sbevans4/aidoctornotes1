
import React from "react";
import { Percent } from "lucide-react";

interface ReferralBannerProps {
  discount?: number;
}

export const ReferralBanner: React.FC<ReferralBannerProps> = ({ discount }) => {
  if (!discount) return null;
  
  return (
    <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-6">
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Percent className="h-5 w-5 text-green-600" />
          </div>
        </div>
        <div>
          <p className="font-medium text-green-800">Special Discount Applied!</p>
          <p className="text-sm text-green-700">
            Your referral code gives you {discount}% off any plan. This discount will be automatically applied at checkout.
          </p>
        </div>
      </div>
    </div>
  );
};
