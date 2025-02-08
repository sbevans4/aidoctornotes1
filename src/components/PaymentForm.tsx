
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquarePayment } from "./payments/SquarePayment";
import { StripePayment } from "./payments/StripePayment";
import { PayPalPayment } from "./payments/PayPalPayment";
import { QRCodePayment } from "./payments/QRCodePayment";

interface PaymentFormProps {
  planId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PaymentForm = ({ planId, onSuccess, onCancel }: PaymentFormProps) => {
  return (
    <Card className="p-6">
      <Tabs defaultValue="card" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="card">Credit Card</TabsTrigger>
          <TabsTrigger value="stripe">Stripe</TabsTrigger>
          <TabsTrigger value="paypal">PayPal</TabsTrigger>
          <TabsTrigger value="qr">QR Code</TabsTrigger>
        </TabsList>
        
        <TabsContent value="card">
          <SquarePayment 
            planId={planId} 
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </TabsContent>

        <TabsContent value="stripe">
          <StripePayment 
            planId={planId} 
            onSuccess={onSuccess}
          />
        </TabsContent>
        
        <TabsContent value="paypal">
          <PayPalPayment 
            planId={planId}
            onSuccess={onSuccess}
            onCancel={onCancel}
          />
        </TabsContent>

        <TabsContent value="qr">
          <QRCodePayment onCancel={onCancel} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};
