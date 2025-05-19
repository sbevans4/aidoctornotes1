
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ReferralStats {
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
  monthlyReferrals?: {
    [month: string]: number;
  };
  conversionRate?: number;
}

export interface ReferralCode {
  code?: string;
}

export interface ReferralDiscount {
  activeDiscount?: number;
  expiryDate?: string;
}

export type ReferralData = ReferralStats & ReferralCode & ReferralDiscount;

export const useReferralData = () => {
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
            recentReferrals: statsData.recent_referrals || [],
            monthlyReferrals: statsData.monthly_referrals || {},
            conversionRate: statsData.conversion_rate || 0
          };
        }

        return result;
      } catch (error) {
        console.error("Error in useReferralData:", error);
        return {};
      }
    },
    refetchOnWindowFocus: false
  });

  return {
    referralData,
    isLoading,
    error,
    refetch
  };
};
