
import { Button } from "@/components/ui/button";
import { usePayPalScript } from "@/hooks/use-paypal-script";
import { PayPalButtonContainer } from "./PayPalButtonContainer";
import { useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [isLoading, setIsLoading] = useState(true);
  
  usePayPalScript(planId);
  
  // Check if PayPal script is loaded
  setTimeout(() => {
    if (!window.paypal) {
      console.log("PayPal script not loaded yet");
    } else {
      setIsLoading(false);
    }
  }, 2000);

  return (
    <div className="space-y-6">
      {isLoading ? (
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
