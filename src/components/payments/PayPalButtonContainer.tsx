
import React, { useEffect } from "react";
import { usePayPalSubscription } from "@/hooks/use-paypal-subscription";
import { toast } from "@/hooks/use-toast";

interface PayPalButtonContainerProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PayPalButtonContainer = ({ planId, onSuccess, onCancel }: PayPalButtonContainerProps) => {
  const { createSubscription, activateSubscription } = usePayPalSubscription(planId, onSuccess);

  useEffect(() => {
    if (window.paypal) {
      window.paypal.Buttons({
        createSubscription,
        onApprove: async (data: any) => {
          console.log('PayPal subscription approved:', data);
          await activateSubscription(data.subscriptionID);
        },
        onError: (err: any) => {
          console.error('PayPal error:', err);
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was an error processing your payment. Please try again.",
          });
        },
        onCancel: () => {
          console.log('PayPal subscription cancelled');
          toast({
            title: "Cancelled",
            description: "Payment cancelled. No charges were made.",
          });
          onCancel();
        }
      }).render("#paypal-button-container");
    }
  }, [createSubscription, activateSubscription, onCancel]);

  return <div id="paypal-button-container" className="w-full" />;
};

