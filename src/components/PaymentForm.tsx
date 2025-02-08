
import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentFormContent = ({ planId, onSuccess, onCancel }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    try {
      const { error: paymentError, paymentMethod } = await stripe.createPaymentMethod({
        elements,
        params: {
          type: 'card',
        },
      });

      if (paymentError) throw paymentError;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create payment method in our database
      const { error: stripeError } = await supabase.functions.invoke('stripe', {
        body: {
          action: 'create_payment_method',
          paymentMethodId: paymentMethod.id,
          userId: user.id,
        },
      });

      if (stripeError) throw stripeError;

      // Create subscription
      const { error: subscriptionError } = await supabase.functions.invoke('stripe', {
        body: {
          action: 'create_subscription',
          paymentMethodId: paymentMethod.id,
          userId: user.id,
          planId,
          email: user.email,
        },
      });

      if (subscriptionError) throw subscriptionError;

      toast({
        title: "Success",
        description: "Your subscription has been activated",
      });
      
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!stripe || isLoading}>
          {isLoading ? "Processing..." : "Subscribe"}
        </Button>
      </div>
    </form>
  );
};

export const PaymentForm = (props: PaymentFormProps) => {
  return (
    <Card className="p-6">
      <Elements stripe={stripePromise}>
        <PaymentFormContent {...props} />
      </Elements>
    </Card>
  );
};
