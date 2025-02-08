
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { StripeCheckoutForm } from "./StripeCheckoutForm";

interface StripePaymentProps {
  planId: string;
  onSuccess: () => void;
}

const stripePromise = loadStripe(process.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

export const StripePayment = ({ planId, onSuccess }: StripePaymentProps) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm planId={planId} onSuccess={onSuccess} />
    </Elements>
  );
};
