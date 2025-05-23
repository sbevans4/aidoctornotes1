
import { Button } from "@/components/ui/button";
import { usePayPalScript } from "@/hooks/use-paypal-script";
import { PayPalButtonContainer } from "./PayPalButtonContainer";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
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
      <LoadingOverlay 
        loading={isLoading || !isPayPalReady} 
        message="Loading PayPal payment options..."
        fullOverlay={false}
      >
        <PayPalButtonContainer 
          planId={planId}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </LoadingOverlay>
      
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
