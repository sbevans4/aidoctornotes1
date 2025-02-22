
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReferralData {
  activeDiscount?: number;
  referralCode?: string;
}

export const useReferral = () => {
  const { toast } = useToast();

  const { data: referralData, isLoading } = useQuery({
    queryKey: ["referral-data"],
    queryFn: async (): Promise<ReferralData> => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return {};

      // Check for active referral discount
      const { data: referral } = await supabase
        .from("referrals")
        .select("discount_percentage, status")
        .eq("referred_id", user.id)
        .eq("status", "active")
        .single();

      // Get user's referral code
      const { data: referralCode } = await supabase
        .from("referral_codes")
        .select("code")
        .eq("user_id", user.id)
        .single();

      return {
        activeDiscount: referral?.discount_percentage,
        referralCode: referralCode?.code,
      };
    },
  });

  const applyReferral = useMutation({
    mutationFn: async (code: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // First, find the referrer based on the referral code
      const { data: referralCode, error: referralCodeError } = await supabase
        .from("referral_codes")
        .select("user_id")
        .eq("code", code)
        .single();

      if (referralCodeError) throw new Error("Invalid referral code");
      if (referralCode.user_id === user.id) throw new Error("You cannot use your own referral code");

      // Then create the referral with both referrer and referred IDs
      const { data: referral, error } = await supabase
        .from("referrals")
        .insert([
          {
            referred_id: user.id,
            referrer_id: referralCode.user_id,
            status: "active",
            discount_percentage: 10, // Default 10% discount
            discount_applied: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return referral;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Referral code applied successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
  });

  return {
    referralData,
    isLoading,
    applyReferral,
  };
};
