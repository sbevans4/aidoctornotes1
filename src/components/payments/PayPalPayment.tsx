
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PayPalPaymentProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PayPalPayment = ({ planId, onSuccess, onCancel }: PayPalPaymentProps) => {
  return (
    <div className="space-y-6">
      <div id="paypal-button-container" className="w-full">
        {/* PayPal's SDK will inject the button here */}
      </div>
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
