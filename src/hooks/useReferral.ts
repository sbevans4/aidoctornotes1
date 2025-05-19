
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReferralData {
  code?: string;
  activeDiscount?: number;
  expiryDate?: string;
}

export const useReferral = () => {
  const { data: referralData, isLoading } = useQuery({
    queryKey: ["referral-data"],
    queryFn: async (): Promise<ReferralData> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return {};

        // Check for active referral discount
        const { data, error } = await supabase
          .from("referrals")
          .select("discount_percentage, updated_at, subscription_duration")
          .eq("referred_id", user.id)
          .eq("discount_applied", true)
          .single();

        if (error || !data) return {};

        // Calculate if the discount is still valid based on subscription_duration
        const discountStartDate = new Date(data.updated_at);
        const discountDuration = data.subscription_duration; // This is stored as an interval in PostgreSQL
        
        // For simplicity, we'll assume the duration is in months and parse it
        const durationMatch = discountDuration?.match(/(\d+) mons/);
        const durationMonths = durationMatch ? parseInt(durationMatch[1]) : 0;
        
        const expiryDate = new Date(discountStartDate);
        expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

        // Check if discount is still valid
        if (expiryDate > new Date()) {
          return {
            activeDiscount: data.discount_percentage,
            expiryDate: expiryDate.toISOString()
          };
        }

        return {};
      } catch (error) {
        console.error("Error fetching referral data:", error);
        return {};
      }
    },
    // Don't refetch on window focus for this query
    refetchOnWindowFocus: false
  });

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

      return "Referral code applied successfully!";
    }
  });

  const sendReferralInvite = useMutation({
    mutationFn: async (email: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get or create referral code for the user
      let code;
      const { data: existingCode, error: codeError } = await supabase
        .from("referral_codes")
        .select("code")
        .eq("user_id", user.id)
        .single();

      if (codeError || !existingCode) {
        // Generate a new code
        code = `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        
        const { error: insertError } = await supabase
          .from("referral_codes")
          .insert({
            user_id: user.id,
            code
          });
          
        if (insertError) {
          throw new Error("Failed to create referral code");
        }
      } else {
        code = existingCode.code;
      }

      // Record the invitation
      const { error: inviteError } = await supabase
        .from("referral_invites")
        .insert({
          referrer_id: user.id,
          email,
          code
        });

      if (inviteError) {
        throw new Error("Failed to send invite");
      }

      // In a real implementation, you'd send an email here
      return "Referral invitation sent!";
    }
  });

  return {
    referralData,
    isLoading,
    applyReferral,
    sendReferralInvite
  };
};
