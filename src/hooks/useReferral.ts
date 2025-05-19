
import { useReferralData, type ReferralData } from "./referral/useReferralData";
import { useReferralCode } from "./referral/useReferralCode";
import { useReferralInvite } from "./referral/useReferralInvite";

export type { ReferralData };

export const useReferral = () => {
  const { referralData, isLoading, error, refetch } = useReferralData();
  const { checkReferralCode, applyReferral } = useReferralCode();
  const { sendReferralInvite } = useReferralInvite();

  // Helper function to get referral status summary
  const getReferralSummary = () => {
    if (!referralData) return null;
    
    return {
      totalCount: referralData.totalReferrals || 0,
      pendingCount: referralData.pendingReferrals || 0,
      completedCount: referralData.completedReferrals || 0,
      conversionRate: referralData.totalReferrals 
        ? Math.round(((referralData.successfulConversions || 0) / referralData.totalReferrals) * 100)
        : 0
    };
  };

  // Helper function to format earnings as currency
  const getFormattedEarnings = () => {
    if (!referralData?.earnings) return "$0.00";
    return `$${referralData.earnings.toFixed(2)}`;
  };

  return {
    referralData,
    isLoading,
    error,
    refetch,
    applyReferral,
    sendReferralInvite,
    checkReferralCode,
    getReferralSummary,
    getFormattedEarnings
  };
};
