
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PaymentFormProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm = ({ planId, onSuccess, onCancel }: PaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [payments, setPayments] = useState<any>(null);

  useEffect(() => {
    const initializeSquare = async () => {
      try {
        const { data: { SQUARE_SANDBOX_APP_ID } } = await supabase
          .functions.invoke('square', {
            body: { action: 'get_app_id' }
          });

        if (!SQUARE_SANDBOX_APP_ID) {
          throw new Error('Square App ID not configured');
        }

        const paymentsInstance = await (window as any).Square.payments(SQUARE_SANDBOX_APP_ID, '12345');
        const card = await paymentsInstance.card();
        await card.attach('#square-payment-form');
        setPayments(paymentsInstance);
      } catch (error) {
        console.error('Failed to initialize Square:', error);
        toast({
          title: "Error",
          description: "Failed to initialize payment form",
          variant: "destructive",
        });
      }
    };

    initializeSquare();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Create payment method and subscription using Square
      const { error: subscriptionError } = await supabase.functions.invoke('square', {
        body: {
          action: 'create_subscription',
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
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div id="square-payment-form" className="min-h-[100px]">
          {/* Square's Web Payment SDK will inject the payment form here */}
        </div>
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || !payments}>
            {isLoading ? "Processing..." : "Subscribe"}
          </Button>
        </div>
      </form>
    </Card>
  );
};

