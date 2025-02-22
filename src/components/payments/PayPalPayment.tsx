
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

declare global {
  interface Window {
    paypal?: any;
  }
}

interface PayPalPaymentProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PayPalPayment = ({ planId, onSuccess, onCancel }: PayPalPaymentProps) => {
  useEffect(() => {
    // Load PayPal script
    const script = document.createElement("script");
    // Replace 'your_client_id' with your actual PayPal client ID
    script.src = "https://www.paypal.com/sdk/js?client-id=your_client_id&currency=USD";
    script.async = true;
    
    script.onload = () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { data, error } = await supabase.functions.invoke('paypal', {
              body: { action: 'create_subscription', userId: user.id, planId }
            });

            if (error || !data?.subscriptionId) {
              console.error('Subscription creation error:', error);
              throw new Error("Failed to create subscription");
            }

            return data.subscriptionId;
          },
          onApprove: async (data: any) => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            try {
              const { error } = await supabase.functions.invoke('paypal', {
                body: {
                  action: 'activate_subscription',
                  userId: user.id,
                  subscriptionId: data.subscriptionId,
                  planId
                }
              });

              if (error) throw error;

              toast({
                title: "Success",
                description: "Your subscription has been activated!",
              });
              onSuccess();
            } catch (error) {
              console.error('PayPal activation error:', error);
              toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to activate subscription. Please try again.",
              });
            }
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
            toast({
              title: "Cancelled",
              description: "Payment cancelled. No charges were made.",
            });
            onCancel();
          }
        }).render("#paypal-button-container");
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [planId, onSuccess, onCancel]);

  return (
    <div className="space-y-6">
      <div id="paypal-button-container" className="w-full">
        {/* PayPal's SDK will inject the button here */}
      </div>
      <div className="flex justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};
