
import React from "react";
import { Gift, Percent } from "lucide-react";

interface ReferralBannerProps {
  discount?: number;
}

export const ReferralBanner = ({ discount }: ReferralBannerProps) => {
  if (!discount) return null;
  
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center justify-center gap-2 text-green-700">
        <Gift className="w-5 h-5" />
        <span className="font-semibold">
          You have a {discount}% discount available on all plans!
        </span>
        <Percent className="w-4 h-4" />
      </div>
    </div>
  );
};
