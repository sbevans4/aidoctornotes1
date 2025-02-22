
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ReferralData {
  activeDiscount?: number;
  referralCode?: string;
}

export const useReferral = () => {
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

  return {
    referralData,
    isLoading,
  };
};
