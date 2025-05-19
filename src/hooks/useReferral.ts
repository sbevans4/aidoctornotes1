import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface ReferralData {
  code?: string;
  activeDiscount?: number;
  expiryDate?: string;
  totalReferrals?: number;
  pendingReferrals?: number;
  completedReferrals?: number;
  successfulConversions?: number;
  earnings?: number;
  recentReferrals?: Array<{
    id: string;
    status: string;
    created_at: string;
    email: string;
  }>;
}

export const useReferral = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: referralData, isLoading, error, refetch } = useQuery({
    queryKey: ["referral-data"],
    queryFn: async (): Promise<ReferralData> => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return {};

        // Get the user's referral code
        const { data: codeData, error: codeError } = await supabase
          .from("referral_codes")
          .select("code")
          .eq("user_id", user.id)
          .single();
        
        // Check for active referral discount
        const { data: discountData, error: discountError } = await supabase
          .from("referrals")
          .select("discount_percentage, updated_at, subscription_duration")
          .eq("referred_id", user.id)
          .eq("discount_applied", true)
          .single();

        // Get statistics about referrals
        const { data: statsData, error: statsError } = await supabase.functions.invoke('get-referral-stats', {
          body: { user_id: user.id }
        });

        // Handle no data or errors
        if ((codeError && codeError.code !== 'PGRST116') || 
            (discountError && discountError.code !== 'PGRST116')) {
          console.error("Error fetching referral data:", codeError || discountError);
          return {};
        }

        if (statsError) {
          console.error("Error fetching referral stats:", statsError);
        }

        let result: ReferralData = {};
        
        // Set code if available
        if (codeData) {
          result.code = codeData.code;
        }
        
        // Calculate discount info if available
        if (discountData) {
          const discountStartDate = new Date(discountData.updated_at);
          let durationMonths = 3; // Default to 3 months
          
          // Parse the duration if present
          const subscriptionDuration = discountData.subscription_duration;
          if (typeof subscriptionDuration === 'string') {
            const durationMatch = subscriptionDuration.match(/(\d+)\s*mons/i);
            if (durationMatch && durationMatch[1]) {
              durationMonths = parseInt(durationMatch[1], 10);
            }
          }
          
          const expiryDate = new Date(discountStartDate);
          expiryDate.setMonth(expiryDate.getMonth() + durationMonths);

          // Check if discount is still valid
          if (expiryDate > new Date()) {
            result.activeDiscount = discountData.discount_percentage;
            result.expiryDate = expiryDate.toISOString();
          }
        }

        // Add referral statistics if available
        if (statsData) {
          result = {
            ...result,
            totalReferrals: statsData.total_referrals || 0,
            pendingReferrals: statsData.pending_referrals || 0,
            completedReferrals: statsData.completed_referrals || 0,
            successfulConversions: statsData.successful_conversions || 0,
            earnings: statsData.earnings || 0,
            recentReferrals: statsData.recent_referrals || []
          };
        }

        return result;
      } catch (error) {
        console.error("Error in useReferral:", error);
        return {};
      }
    },
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

  const sendReferralInvite = useMutation({
    mutationFn: async (email: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

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

      // In a real implementation, you would send an email here
      // For now, we'll just trigger a webhook to handle the email sending
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
      
      return "Referral invitation sent!";
    },
    onSuccess: (_, email) => {
      toast({
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

  return {
    referralData,
    isLoading,
    error,
    refetch,
    applyReferral,
    sendReferralInvite,
    checkReferralCode
  };
};
