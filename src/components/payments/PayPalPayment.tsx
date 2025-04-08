
import { Button } from "@/components/ui/button";
import { usePayPalScript } from "@/hooks/use-paypal-script";
import { PayPalButtonContainer } from "./PayPalButtonContainer";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
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
  const [isPayPalReady, setIsPayPalReady] = useState(false);
  const { isLoaded, isLoading } = usePayPalScript(planId);
  
  useEffect(() => {
    if (isLoaded && window.paypal) {
      setIsPayPalReady(true);
    } else if (isLoaded && !window.paypal) {
      // PayPal script is loaded but paypal object is not available
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to initialize PayPal. Please refresh the page and try again.",
      });
    }
  }, [isLoaded]);

  return (
    <div className="space-y-6">
      {isLoading || !isPayPalReady ? (
        <div className="flex flex-col items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-sm text-muted-foreground">Loading PayPal payment options...</p>
        </div>
      ) : (
        <PayPalButtonContainer 
          planId={planId}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      )}
      
      <div className="flex justify-end mt-4">
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
