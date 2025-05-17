
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface OneTimePaymentProps {
  amount?: number;
  productName?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const OneTimePayment = ({
  amount = 1099,  // Default $10.99
  productName = "Medical Documentation Service",
  onSuccess,
  onCancel
}: OneTimePaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { amount, productName }
      });

      if (error) throw new Error(error.message);
      
      if (data?.url) {
        // Open the Stripe checkout in a new tab
        window.open(data.url, '_blank');
        
        // Not calling onSuccess here since we can't detect completion
        // The success URL will handle completion
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to initiate payment",
        variant: "destructive",
      });
      if (onCancel) onCancel();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>One-Time Payment</CardTitle>
        <CardDescription>Purchase {productName}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center my-4">
          <p className="text-3xl font-bold">${(amount / 100).toFixed(2)}</p>
          <p className="text-muted-foreground mt-1">One-time payment</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button 
          onClick={handlePayment}
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Processing..." : "Proceed to Payment"}
        </Button>
      </CardFooter>
    </Card>
  );
};
