
import React, { useState } from "react";
import { Percent, Gift, ArrowRight, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface ReferralBannerProps {
  discount?: number;
  expiryDate?: string;
  referralCode?: string;
}

export const ReferralBanner: React.FC<ReferralBannerProps> = ({ discount, expiryDate, referralCode }) => {
  const [dismissed, setDismissed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  if (dismissed || !discount) return null;
  
  // Format expiry date if provided
  const formattedExpiryDate = expiryDate 
    ? new Date(expiryDate).toLocaleDateString(undefined, { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : null;
  
  const handleCopyReferralCode = async () => {
    if (!referralCode) return;
    
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      
      toast({
        title: "Copied!",
        description: "Referral code copied to clipboard",
      });
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      });
    }
  };

  return (
    <div 
      className={cn(
        "bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-lg p-4 mb-6 shadow-sm",
        "animate-fade-in transition-all duration-300"
      )} 
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
            
            <div className="mt-3 flex flex-wrap gap-3">
              <a 
                href="/subscription-plans" 
                className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 bg-white px-3 py-1.5 rounded-md border border-green-100 hover:bg-green-50 transition-colors"
              >
                View subscription plans
                <ArrowRight className="ml-1 h-4 w-4" />
              </a>
              
              {referralCode && (
                <div 
                  className="flex items-center bg-white py-1.5 pl-3 pr-1.5 rounded-md border border-green-100 cursor-pointer"
                  onClick={handleCopyReferralCode}
                >
                  <span className="text-sm text-green-600 font-medium mr-2">Your referral code: </span>
                  <span className="bg-green-50 px-2 py-1 rounded border border-green-100 font-mono text-sm">{referralCode}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-auto ml-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyReferralCode();
                    }}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-green-500 hover:text-green-700" />
                    )}
                  </Button>
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
        <Gift className="h-4 w-4 text-green-600 mr-1.5" />
        <span className="text-green-700">
          Want more discounts? <Button variant="link" className="p-0 h-auto text-green-700 font-medium underline" onClick={() => window.location.href = "/services/ai-therapy-notes#referral"}>
            Refer more colleagues
          </Button>
        </span>
      </div>
    </div>
  );
};
