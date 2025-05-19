
import { useReferralData, type ReferralData } from "./referral/useReferralData";
import { useReferralCode } from "./referral/useReferralCode";
import { useReferralInvite } from "./referral/useReferralInvite";

export type { ReferralData };

export const useReferral = () => {
  const { referralData, isLoading, error, refetch } = useReferralData();
  const { checkReferralCode, applyReferral } = useReferralCode();
  const { sendReferralInvite } = useReferralInvite();

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
