
import React, { useState } from "react";
import { Percent, Gift, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReferralBannerProps {
  discount?: number;
  expiryDate?: string;
  referralCode?: string;
}

export const ReferralBanner: React.FC<ReferralBannerProps> = ({ discount, expiryDate, referralCode }) => {
  const [dismissed, setDismissed] = useState(false);
  
  if (dismissed || !discount) return null;
  
  // Format expiry date if provided
  const formattedExpiryDate = expiryDate 
    ? new Date(expiryDate).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : null;

  return (
    <div 
      className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 mb-6 shadow-sm animate-fade-in" 
      role="alert"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start">
          <div className="flex-shrink-0 mb-2 sm:mb-0 sm:mr-3">
            <div className="bg-green-100 p-2 rounded-full">
              <Percent className="h-5 w-5 text-green-600" aria-hidden="true" />
            </div>
          </div>
          <div className="ml-3">
            <h3 className="font-semibold text-green-800 text-lg">Special Discount Applied!</h3>
            <p className="text-green-700 mt-1">
              Your referral code gives you {discount}% off any plan. This discount will be automatically applied at checkout
              {formattedExpiryDate && ` (valid until ${formattedExpiryDate})`}.
            </p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <a href="/subscription-plans" className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800">
                View subscription plans
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
              
              {referralCode && (
                <div className="text-sm">
                  <span className="text-green-600 font-medium">Your referral code: </span>
                  <span className="bg-white px-2 py-1 rounded border border-green-200 font-mono">{referralCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button 
          onClick={() => setDismissed(true)}
          className="text-green-500 hover:text-green-700 focus:outline-none"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mt-3 ml-11 text-sm flex items-center">
        <Gift className="h-4 w-4 text-green-600 mr-1" />
        <span className="text-green-700">
          Want more discounts? <Button variant="link" className="p-0 h-auto text-green-700 font-medium underline" onClick={() => window.location.href = "/services/ai-therapy-notes#referral"}>
            Refer more colleagues
          </Button>
        </span>
      </div>
    </div>
  );
};
