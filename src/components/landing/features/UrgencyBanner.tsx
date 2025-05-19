
import React from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

export const UrgencyBanner = () => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-amber-100 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-2 text-amber-700">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          <span className="font-semibold">
            Limited time offer: Try Professional free for 7 days! No credit card required.
          </span>
        </div>
        <Button 
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white border-none"
        >
          Start Free Trial
        </Button>
      </div>
    </div>
  );
};
