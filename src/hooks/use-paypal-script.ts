
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

        // Check if PayPal is already loaded to avoid duplicate scripts
        if (document.querySelector('script[src*="www.paypal.com/sdk/js"]')) {
          return;
        }

        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${process.env.PAYPAL_CLIENT_ID || 'test'}&currency=USD&intent=subscription`;
        script.async = true;

        script.onload = () => {
          console.log('PayPal SDK loaded successfully');
        };

        script.onerror = (err) => {
          console.error('Error loading PayPal SDK:', err);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load payment system. Please try again later.",
          });
        };

        document.body.appendChild(script);

        return () => {
          const existingScript = document.querySelector('script[src*="www.paypal.com/sdk/js"]');
          if (existingScript) {
            document.body.removeChild(existingScript);
          }
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
