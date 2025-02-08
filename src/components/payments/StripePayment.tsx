
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { StripeCheckoutForm } from "./StripeCheckoutForm";
import type { Stripe, StripeElementsOptions } from '@stripe/stripe-js';

interface StripePaymentProps {
  planId: string;
  onSuccess: () => void;
}

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const StripePayment = ({ planId, onSuccess }: StripePaymentProps) => {
  const [clientSecret, setClientSecret] = useState<string>();

  // Initialize payment when component mounts
  useEffect(() => {
    const initializePayment = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data: response, error } = await supabase.functions.invoke('stripe', {
          body: {
            action: 'create_subscription',
            userId: user.id,
            planId,
            email: user.email,
          },
        });

        if (error) throw error;
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error('Failed to initialize payment:', error);
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive",
        });
      }
    };

    initializePayment();
  }, [planId]);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeCheckoutForm planId={planId} onSuccess={onSuccess} />
    </Elements>
  );
};
