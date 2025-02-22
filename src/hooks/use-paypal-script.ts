
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePayPalScript = (planId: string) => {
  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        const { data: plan, error: planError } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('id', planId)
          .single();

        if (planError || !plan) {
          console.error('Error fetching plan:', planError);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Could not load plan details. Please try again.",
          });
          return;
        }

        if (!plan.paypal_plan_id) {
          console.error('No PayPal plan ID configured for this subscription plan');
          toast({
            variant: "destructive",
            title: "Error",
            description: "This payment method is not available for the selected plan.",
          });
          return;
        }

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${plan.paypal_plan_id}&currency=USD&intent=subscription`;
        script.async = true;

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
  }, [planId]);
};

