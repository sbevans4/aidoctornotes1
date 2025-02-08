import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface PaymentFormProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm = ({ planId, onSuccess, onCancel }: PaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [squarePayments, setSquarePayments] = useState<any>(null);

  useEffect(() => {
    const initializePaymentSystems = async () => {
      try {
        // Initialize Square
        const { data: { SQUARE_SANDBOX_APP_ID } } = await supabase
          .functions.invoke('square', {
            body: { action: 'get_app_id' }
          });

        if (SQUARE_SANDBOX_APP_ID) {
          const paymentsInstance = await (window as any).Square.payments(SQUARE_SANDBOX_APP_ID);
          const card = await paymentsInstance.card();
          await card.attach('#square-payment-form');
          setSquarePayments(paymentsInstance);
        }

        // Initialize PayPal
        (window as any).paypal.Buttons({
          style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'subscribe'
          },
          createSubscription: async (data: any, actions: any) => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) throw new Error("User not authenticated");

              const { data: response, error } = await supabase.functions.invoke('paypal', {
                body: {
                  action: 'create_subscription',
                  userId: user.id,
                  planId,
                  email: user.email,
                }
              });

              if (error) throw error;
              return response.subscriptionId;
            } catch (error) {
              console.error('PayPal subscription error:', error);
              toast({
                title: "Error",
                description: "Failed to create subscription",
                variant: "destructive",
              });
              throw error;
            }
          },
          onApprove: async (data: any, actions: any) => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (!user) throw new Error("User not authenticated");

              await supabase.functions.invoke('paypal', {
                body: {
                  action: 'activate_subscription',
                  userId: user.id,
                  subscriptionId: data.subscriptionID,
                  planId,
                }
              });

              toast({
                title: "Success",
                description: "Your subscription has been activated",
              });
              onSuccess();
            } catch (error) {
              console.error('PayPal activation error:', error);
              toast({
                title: "Error",
                description: "Failed to activate subscription",
                variant: "destructive",
              });
            }
          }
        }).render('#paypal-button-container');
      } catch (error) {
        console.error('Failed to initialize payment systems:', error);
        toast({
          title: "Error",
          description: "Failed to initialize payment form",
          variant: "destructive",
        });
      }
    };

    initializePaymentSystems();
  }, [planId, onSuccess]);

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
    <Card className="p-6">
      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="card">Credit Card</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card">
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
                {isLoading ? "Processing..." : "Subscribe"}
              </Button>
            </div>
          </form>
        </TabsContent>
        
        <TabsContent value="paypal">
          <div className="space-y-6">
            <div id="paypal-button-container" className="w-full">
              {/* PayPal's SDK will inject the button here */}
            </div>
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="qr">
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-4">
              <img 
                src="/lovable-uploads/37951682-7649-460c-93c1-a4c5c7e02ff3.png" 
                alt="PayPal QR Code"
                className="w-64 h-64 object-contain"
              />
              <p className="text-sm text-gray-600 mt-4 text-center">
                Scan this QR code with your PayPal app to complete the payment
              </p>
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
        </TabsContent>
      </Tabs>
    </Card>
  );
};
