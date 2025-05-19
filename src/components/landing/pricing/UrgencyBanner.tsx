
import React from "react";
import { Percent, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UrgencyBannerProps {
  onDismiss: () => void;
}

export const UrgencyBanner = ({ onDismiss }: UrgencyBannerProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-amber-100 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-2 text-amber-700">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Percent className="w-5 h-5 mr-2" />
            <span className="font-semibold mr-2">
              Limited time offer: 20% off Professional plan for the first 3 months!
            </span>
            <div className="hidden md:flex items-center bg-amber-200 text-amber-800 px-2 py-1 rounded">
              <Clock className="w-3 h-3 mr-1" />
              <span className="text-xs font-bold">Offer ends in 3 days</span>
            </div>
          </div>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="border-amber-300 hover:bg-amber-200 text-amber-700"
          onClick={onDismiss}
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
};
