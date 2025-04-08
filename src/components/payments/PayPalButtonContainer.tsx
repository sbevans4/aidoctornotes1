
import React, { useEffect, useRef } from "react";
import { usePayPalSubscription } from "@/hooks/use-paypal-subscription";
import { toast } from "@/hooks/use-toast";

interface PayPalButtonContainerProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PayPalButtonContainer = ({ planId, onSuccess, onCancel }: PayPalButtonContainerProps) => {
  const { createSubscription, activateSubscription } = usePayPalSubscription(planId, onSuccess);
  const paypalContainerRef = useRef<HTMLDivElement>(null);
  const buttonRendered = useRef(false);

  useEffect(() => {
    const renderPayPalButton = () => {
      // Clear previous buttons to avoid duplicates
      if (paypalContainerRef.current) {
        paypalContainerRef.current.innerHTML = '';
      }
      
      if (window.paypal && !buttonRendered.current) {
        try {
          window.paypal.Buttons({
            style: {
              layout: 'vertical',
              color: 'blue',
              shape: 'rect',
              label: 'subscribe'
            },
            createSubscription,
            onApprove: async (data: any) => {
              console.log('PayPal subscription approved:', data);
              await activateSubscription(data.subscriptionID);
            },
            onError: (err: any) => {
              console.error('PayPal error:', err);
              toast({
                variant: "destructive",
                title: "PayPal Error",
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
          }).render(paypalContainerRef.current);
          
          buttonRendered.current = true;
        } catch (error) {
          console.error('Error rendering PayPal buttons:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load payment options. Please try again later.",
          });
        }
      }
    };

    // Wait for paypal to load
    const checkPayPalSDKLoaded = () => {
      if (window.paypal) {
        renderPayPalButton();
      } else {
        setTimeout(checkPayPalSDKLoaded, 100);
      }
    };

    checkPayPalSDKLoaded();

    return () => {
      buttonRendered.current = false;
    };
  }, [createSubscription, activateSubscription, onCancel]);

  return (
    <div className="w-full min-h-[150px] flex items-center justify-center">
      <div ref={paypalContainerRef} className="w-full" />
    </div>
  );
};
