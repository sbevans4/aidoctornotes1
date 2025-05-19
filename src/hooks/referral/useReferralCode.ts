
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export const useReferralCode = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check if a referral code is valid
  const checkReferralCode = useMutation({
    mutationFn: async (code: string) => {
      const { data, error } = await supabase
        .from("referral_codes")
        .select("user_id, code")
        .eq("code", code)
        .single();

      if (error || !data) {
        throw new Error("Invalid referral code");
      }

      return { 
        isValid: true,
        code: data.code
      };
    }
  });

  // Apply a referral code to the current user
  const applyReferral = useMutation({
    mutationFn: async (referralCode: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from("referral_codes")
        .select("user_id, code")
        .eq("code", referralCode)
        .single();

      if (error || !data) {
        throw new Error("Invalid referral code");
      }

      // Make sure user is not referring themselves
      if (data.user_id === user.id) {
        throw new Error("You cannot use your own referral code");
      }

      // Create a new referral record
      const { error: insertError } = await supabase
        .from("referrals")
        .insert({
          referrer_id: data.user_id,
          referred_id: user.id,
          discount_applied: true,
          status: "active"
        });

      if (insertError) {
        throw new Error("Failed to apply referral code");
      }

      // Invalidate the query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["referral-data"] });
      
      return "Referral code applied successfully!";
    },
    onSuccess: (data) => {
      toast({
        title: "Referral Applied!",
        description: data,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Applying Referral",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  return {
    checkReferralCode,
    applyReferral
  };
};
