
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ReferralData {
  activeDiscount?: number;
  referralCode?: string;
}

interface SendReferralInviteParams {
  email: string;
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
            discount_percentage: 20, // Updated to 20% discount
            discount_applied: false,
            subscription_duration: '3 months' // Added subscription duration
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

  const sendReferralInvite = useMutation({
    mutationFn: async ({ email }: SendReferralInviteParams) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Get or create a referral code for the user
      let { data: existingCode } = await supabase
        .from("referral_codes")
        .select("code")
        .eq("user_id", user.id)
        .single();

      if (!existingCode) {
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        const { data: newReferralCode, error: createCodeError } = await supabase
          .from("referral_codes")
          .insert([{ user_id: user.id, code: newCode }])
          .select()
          .single();

        if (createCodeError) throw createCodeError;
        existingCode = newReferralCode;
      }

      // Create the referral invite
      const { error: inviteError } = await supabase
        .from("referral_invites")
        .insert([
          {
            referrer_id: user.id,
            email,
            code: existingCode.code,
            status: "pending"
          }
        ]);

      if (inviteError) {
        if (inviteError.code === '23505') { // Unique violation
          throw new Error("You've already sent an invite to this email address");
        }
        throw inviteError;
      }

      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Invite Sent",
        description: "Referral invite has been sent successfully!",
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
    sendReferralInvite,
  };
};
