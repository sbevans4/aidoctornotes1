
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

export type SubscriptionTier = 'trial' | 'basic' | 'standard' | 'professional' | 'unlimited' | 'enterprise';

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  type: string;
  tier: SubscriptionTier;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  features: Json;
  type: string;
  tier: SubscriptionTier;
}

export const useSubscription = () => {
  const queryClient = useQueryClient();

  const { data: plans, isLoading: isLoadingPlans } = useQuery({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("subscription_plans")
        .select("*")
        .order("price");

      if (error) throw error;

      return data.map((plan: SubscriptionPlan): Plan => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        features: Array.isArray(plan.features) ? plan.features as string[] : [],
        type: plan.type,
        tier: plan.tier,
      }));
    },
  });

  const { data: currentSubscription, isLoading: isLoadingSubscription } = useQuery({
    queryKey: ["user-subscription"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", user.id)
        .single();

      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
  });

  const checkFeatureAccess = async (featureName: string): Promise<boolean> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      // Use the RPC function to check feature access
      const { data, error } = await supabase
        .rpc('has_feature', { 
          user_id: user.id,
          feature_name: featureName
        });

      if (error) {
        console.error('Error checking feature access:', error);
        throw error;
      }

      return !!data;
    } catch (error) {
      console.error('Error in checkFeatureAccess:', error);
      throw error;
    }
  };

  const subscribeToPlan = useMutation({
    mutationFn: async (planId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.functions.invoke('square', {
        body: {
          action: 'create_subscription',
          userId: user.id,
          planId,
          email: user.email,
        },
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-subscription"] });
      toast({
        title: "Success",
        description: "Your subscription has been updated",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update subscription",
        variant: "destructive",
      });
      console.error("Subscription error:", error);
    },
  });

  return {
    plans,
    currentSubscription,
    isLoading: isLoadingPlans || isLoadingSubscription,
    subscribeToPlan,
    checkFeatureAccess,
  };
};
