
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PayPalButton } from './PayPalButton';

interface PayPalCheckoutProps {
  onCancel: () => void;
  planId?: string;
  amount?: number;
}

export function PayPalCheckout({ onCancel, amount = 10.99, planId }: PayPalCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>PayPal Checkout</CardTitle>
        <CardDescription>Complete your purchase securely with PayPal</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="rounded-md bg-slate-50 p-4">
            <div className="flex justify-between mb-2">
              <span>Amount:</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <PayPalButton 
            amount={amount}
            onCancel={onCancel}
          />
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-end">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </CardFooter>
    </Card>
  );
}
