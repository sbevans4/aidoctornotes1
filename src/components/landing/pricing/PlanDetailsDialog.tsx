
import React from "react";
import { Check } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface PlanDetailsDialogProps {
  open: boolean;
  onOpenChange: () => void;
  plan?: {
    id: string;
    name: string;
    features: string[];
  };
}

export const PlanDetailsDialog = ({ open, onOpenChange, plan }: PlanDetailsDialogProps) => {
  if (!plan) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {plan.name} Plan Features
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <ul className="space-y-3">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};
