
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
    const loadPayPalScript = async () => {
      try {
        // Get the plan details to set up the proper amount
        const { data: plan, error: planError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', planId)
          .single();

        if (planError) {
          console.error('Error fetching plan:', planError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load plan details. Please try again.",
          });
          return;
        }

        // Load PayPal script
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${plan.paypal_plan_id}&currency=USD&intent=subscription`;
        script.async = true;
        
        script.onload = () => {
          if (window.paypal) {
            window.paypal.Buttons({
              createSubscription: async () => {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Please log in to continue.",
                  });
                  throw new Error("User not authenticated");
                }

                const { data, error } = await supabase.functions.invoke('paypal', {
                  body: { 
                    action: 'create_subscription',
                    userId: user.id,
                    planId
                  }
                });

                if (error || !data?.subscriptionId) {
                  console.error('Subscription creation error:', error);
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to create subscription. Please try again.",
                  });
                  throw new Error("Failed to create subscription");
                }

                return data.subscriptionId;
              },
              onApprove: async (data: any) => {
                console.log('PayPal subscription approved:', data);
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Please log in to continue.",
                  });
                  throw new Error("User not authenticated");
                }

                try {
                  const { error } = await supabase.functions.invoke('paypal', {
                    body: {
                      action: 'activate_subscription',
                      userId: user.id,
                      subscriptionId: data.subscriptionID,
                      planId
                    }
                  });

                  if (error) {
                    console.error('PayPal activation error:', error);
                    toast({
                      variant: "destructive",
                      title: "Error",
                      description: "Failed to activate subscription. Please try again.",
                    });
                    throw error;
                  }

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
                console.log('PayPal subscription cancelled');
                toast({
                  title: "Cancelled",
                  description: "Payment cancelled. No charges were made.",
                });
                onCancel();
              }
            }).render("#paypal-button-container");
          }
        };

        script.onerror = () => {
          console.error('Failed to load PayPal script');
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load payment system. Please try again.",
          });
        };

        document.body.appendChild(script);

        return () => {
          document.body.removeChild(script);
        };
      } catch (error) {
        console.error('PayPal initialization error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to initialize payment system. Please try again.",
        });
      }
    };

    loadPayPalScript();
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
