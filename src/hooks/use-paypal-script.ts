
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePayPalScript = (planId: string) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadPayPalScript = async () => {
      try {
        setIsLoading(true);
        
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
          setIsLoaded(true);
          setIsLoading(false);
          return;
        }

        const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID || 'sandbox';
        const script = document.createElement("script");
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=USD&intent=subscription`;
        script.async = true;

        script.onload = () => {
          console.log('PayPal SDK loaded successfully');
          setIsLoaded(true);
          setIsLoading(false);
        };

        script.onerror = (err) => {
          console.error('Error loading PayPal SDK:', err);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load payment system. Please try again later.",
          });
          setIsLoading(false);
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
        setIsLoading(false);
      }
    };

    loadPayPalScript();
  }, [planId]);

  return { isLoaded, isLoading };
};
