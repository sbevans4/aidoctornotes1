
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";

interface PaymentDialogProps {
  open: boolean;
  onOpenChange: () => void;
  planId: string | null;
  onSuccess: () => void;
}

export const PaymentDialog = ({
  open,
  onOpenChange,
  planId,
  onSuccess
}: PaymentDialogProps) => {
  if (!planId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <PaymentForm
          planId={planId}
          onSuccess={onSuccess}
          onCancel={() => onOpenChange()}
        />
      </DialogContent>
    </Dialog>
  );
};
