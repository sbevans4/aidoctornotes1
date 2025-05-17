
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Process different types of payments (Stripe, PayPal, etc.)
  useEffect(() => {
    const processPayment = async () => {
      try {
        setIsProcessing(true);
        
        // Check for Stripe session ID first
        const sessionId = searchParams.get('session_id');
        if (sessionId) {
          toast({
            title: "Payment Successful",
            description: "Thank you for your purchase!",
          });
          return;
        }
        
        // Check for PayPal payment
        const paypalOrderId = localStorage.getItem('paypal_order_id');
        if (paypalOrderId) {
          // Capture the PayPal payment
          const { data, error } = await supabase.functions.invoke('paypal-payment', {
            body: { action: 'capture', orderId: paypalOrderId },
            method: 'POST',
          });
          
          if (error || !data) {
            throw new Error(`Failed to capture payment: ${error?.message}`);
          }
          
          toast({
            title: "Payment Successful",
            description: "Thank you for your purchase!",
          });
          
          // Clean up
          localStorage.removeItem('paypal_order_id');
        }
      } catch (error) {
        console.error('Payment processing error:', error);
        toast({
          variant: "destructive",
          title: "Payment Error",
          description: "There was an error processing your payment.",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    processPayment();
  }, [searchParams]);

  return (
    <div className="container mx-auto py-16 px-4 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {isProcessing ? (
              <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
            ) : (
              <CheckCircle className="text-green-500 h-16 w-16" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {isProcessing ? "Processing Payment..." : "Payment Successful!"}
          </CardTitle>
          <CardDescription>
            {isProcessing ? "Please wait while we confirm your payment." : "Thank you for your purchase."}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">
            {isProcessing 
              ? "This should only take a moment." 
              : "Your payment has been processed successfully. You will receive a confirmation email shortly."}
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => navigate("/")} disabled={isProcessing}>
            Return to Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
