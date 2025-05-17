
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface PayPalButtonProps {
  amount?: number;
  currency?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PayPalButton({
  amount = 10.99,
  currency = 'USD',
  onSuccess,
  onCancel
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePayPalPayment = async () => {
    try {
      setLoading(true);
      
      // Create PayPal order
      const { data, error } = await supabase.functions.invoke('paypal-payment', {
        body: { action: 'create', amount, currency },
        method: 'POST',
      });
      
      if (error) {
        throw new Error(`Failed to create PayPal order: ${error.message}`);
      }
      
      // Find the approval URL in the links array
      const approvalLink = data.links.find(
        (link: { rel: string }) => link.rel === 'approve'
      );
      
      if (!approvalLink) {
        throw new Error('PayPal approval link not found');
      }
      
      // Store the order ID in local storage so we can retrieve it on success
      localStorage.setItem('paypal_order_id', data.id);
      
      // Redirect to PayPal for approval
      window.location.href = approvalLink.href;
      
    } catch (error) {
      console.error('PayPal payment error:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Error',
        description: error.message || 'An error occurred processing your payment',
      });
      setLoading(false);
      
      if (onCancel) {
        onCancel();
      }
    }
  };

  return (
    <Button
      onClick={handlePayPalPayment}
      disabled={loading}
      className="w-full bg-[#0070ba] hover:bg-[#005ea6] text-white"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>Pay with PayPal</>
      )}
    </Button>
  );
}
