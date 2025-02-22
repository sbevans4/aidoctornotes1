
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useReferral = () => {
  const queryClient = useQueryClient();

  // Apply a referral code
  const applyReferral = useMutation({
    mutationFn: async (code: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get the referral code details
      const { data: referralCode, error: referralError } = await supabase
        .from("referral_codes")
        .select("*")
        .eq("code", code)
        .single();

      if (referralError) throw referralError;
      if (!referralCode) throw new Error("Invalid referral code");

      // Create the referral with default 10% discount
      const { error: createError } = await supabase
        .from("referrals")
        .insert({
          referrer_id: referralCode.user_id,
          referred_id: user.id,
          status: "completed",
          discount_percentage: 10.0, // Set the default discount percentage
          discount_applied: false // Initialize as not applied
        });

      if (createError) throw createError;

      // Update the usage count
      const { error: updateError } = await supabase
        .from("referral_codes")
        .update({ times_used: referralCode.times_used + 1 })
        .eq("id", referralCode.id);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral"] });
      toast({
        title: "Success",
        description: "Referral code applied successfully. You will receive a 10% discount on your next purchase.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Generate a referral code for the current user
  const generateReferralCode = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const code = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { error } = await supabase
        .from("referral_codes")
        .insert({
          user_id: user.id,
          code,
        });

      if (error) throw error;
      return code;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral"] });
      toast({
        title: "Success",
        description: "Referral code generated successfully. Share it with others to give them a 10% discount!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Get user's referral details including discount information
  const { data: referralData, isLoading: isLoadingReferral } = useQuery({
    queryKey: ["referral"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const [{ data: codes }, { data: referrals }] = await Promise.all([
        supabase
          .from("referral_codes")
          .select("*")
          .eq("user_id", user.id),
        supabase
          .from("referrals")
          .select("*")
          .or(`referrer_id.eq.${user.id},referred_id.eq.${user.id}`),
      ]);

      return {
        codes: codes || [],
        referrals: referrals || [],
        activeDiscount: referrals?.find(r => 
          r.referred_id === user.id && 
          !r.discount_applied && 
          r.status === "completed"
        )?.discount_percentage || null
      };
    },
  });

  return {
    applyReferral,
    generateReferralCode,
    referralData,
    isLoadingReferral,
  };
};

