
import React from "react";
import { Gift } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrialBannerProps {
  onStartTrial: () => void;
  onDismiss: () => void;
}

export const TrialBanner = ({ onStartTrial, onDismiss }: TrialBannerProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-8">
      <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 flex items-center justify-between gap-2 text-blue-700">
        <div className="flex items-center gap-2">
          <Gift className="w-5 h-5" />
          <span className="font-semibold">
            Try Professional free for 7 days! No credit card required.
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={onStartTrial}
          >
            Start Trial
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-blue-300 hover:bg-blue-200 text-blue-700"
            onClick={onDismiss}
          >
            Dismiss
          </Button>
        </div>
      </div>
    </div>
  );
};
