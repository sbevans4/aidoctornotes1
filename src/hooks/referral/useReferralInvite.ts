
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useReferralInvite = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check rate limits for the user
  const checkReferralLimit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");

    const { data, error } = await supabase.functions.invoke('check-referral-limit', {
      body: { userId: user.id }
    });

    if (error) {
      console.error("Error checking rate limit:", error);
      throw new Error("Failed to check rate limits");
    }

    return data;
  };

  // Get current rate limit status
  const { data: rateLimits, refetch: refetchRateLimits } = useQuery({
    queryKey: ["referral-rate-limits"],
    queryFn: checkReferralLimit,
    enabled: false, // Only fetch when needed
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  const sendReferralInvite = useMutation({
    mutationFn: async (email: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      // Check rate limits first
      const limits = await checkReferralLimit();

      if (!limits.canSendMore) {
        if (limits.dailyRemaining <= 0) {
          throw new Error(`Daily invite limit reached. You can send more invites tomorrow.`);
        } else {
          throw new Error(`Monthly invite limit reached. You can send more invites next month.`);
        }
      }

      // Get or create referral code for the user
      let code: string;
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
          code,
          status: "pending"
        });

      if (inviteError) {
        throw new Error("Failed to send invite");
      }

      // Send the email via edge function
      try {
        await supabase.functions.invoke('send-referral-email', {
          body: { 
            email, 
            referrerName: user.user_metadata?.full_name || user.email,
            code
          }
        });
      } catch (emailError) {
        console.error("Error sending referral email:", emailError);
        // We won't throw here, as the invitation is already recorded
      }

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["referral-data"] });
      queryClient.invalidateQueries({ queryKey: ["referral-rate-limits"] });
      
      return "Referral invitation sent!";
    },
    onSuccess: (_, email) => {
      toast.success({
        title: "Invitation Sent!",
        description: `Invitation email sent to ${email}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error Sending Invitation",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive"
      });
    }
  });

  return {
    sendReferralInvite,
    checkReferralLimit: refetchRateLimits,
    rateLimits
  };
};
