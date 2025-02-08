
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface SquarePaymentProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const SquarePayment = ({ planId, onSuccess, onCancel }: SquarePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [squarePayments, setSquarePayments] = useState<any>(null);

  const handleSquareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

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
    <form onSubmit={handleSquareSubmit} className="space-y-6">
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
        <Button type="submit" disabled={isLoading || !squarePayments}>
          {isLoading ? "Processing..." : "Subscribe with Square"}
        </Button>
      </div>
    </form>
  );
};
