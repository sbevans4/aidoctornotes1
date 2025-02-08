
import { Button } from "@/components/ui/button";

interface QRCodePaymentProps {
  onCancel: () => void;
}

export const QRCodePayment = ({ onCancel }: QRCodePaymentProps) => {
  return (
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
  );
};
