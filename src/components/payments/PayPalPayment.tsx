
import { Button } from "@/components/ui/button";
import { usePayPalScript } from "@/hooks/use-paypal-script";
import { PayPalButtonContainer } from "./PayPalButtonContainer";

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
  usePayPalScript(planId);

  return (
    <div className="space-y-6">
      <PayPalButtonContainer 
        planId={planId}
        onSuccess={onSuccess}
        onCancel={onCancel}
      />
      <div className="flex justify-end">
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
