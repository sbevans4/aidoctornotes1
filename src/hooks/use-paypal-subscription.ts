
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const usePayPalSubscription = (planId: string, onSuccess: () => void) => {
  const createSubscription = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to continue.",
      });
      throw new Error("User not authenticated");
    }

    const { data, error } = await supabase.functions.invoke('paypal', {
      body: { 
        action: 'create_subscription',
        userId: user.id,
        planId
      }
    });

    if (error || !data?.subscriptionId) {
      console.error('Subscription creation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create subscription. Please try again.",
      });
      throw new Error("Failed to create subscription");
    }

    return data.subscriptionId;
  };

  const activateSubscription = async (subscriptionID: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please log in to continue.",
      });
      throw new Error("User not authenticated");
    }

    try {
      const { error } = await supabase.functions.invoke('paypal', {
        body: {
          action: 'activate_subscription',
          userId: user.id,
          subscriptionId: subscriptionID,
          planId
        }
      });

      if (error) {
        console.error('PayPal activation error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to activate subscription. Please try again.",
        });
        throw error;
      }

      toast({
        title: "Success",
        description: "Your subscription has been activated!",
      });
      onSuccess();
    } catch (error) {
      console.error('PayPal activation error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to activate subscription. Please try again.",
      });
    }
  };

  return {
    createSubscription,
    activateSubscription
  };
};

