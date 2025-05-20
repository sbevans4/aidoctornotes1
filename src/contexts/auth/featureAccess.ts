
import { SubscriptionTier } from "@/hooks/useSubscription";

// Feature access matrix based on subscription tier
export const FEATURE_ACCESS: Record<string, Set<SubscriptionTier>> = {
  basic_transcription: new Set(['basic', 'standard', 'unlimited', 'professional', 'image_analysis']),
  unlimited_soap_notes: new Set(['standard', 'unlimited', 'professional', 'image_analysis']),
  code_suggestions: new Set(['standard', 'unlimited', 'professional', 'image_analysis']),
  unlimited_transcription: new Set(['standard', 'unlimited', 'professional', 'image_analysis']),
  image_analysis: new Set(['unlimited', 'professional', 'image_analysis']),
  unlimited_image_analysis: new Set(['image_analysis']),
  team_accounts: new Set(['professional', 'image_analysis']),
  ehr_integration: new Set(['professional', 'image_analysis']),
};

// Check if the user has access to a specific feature
export const checkFeatureAccess = (
  featureName: string, 
  subscriptionTier: SubscriptionTier | null,
  isSubscribed: boolean
): boolean => {
  if (!isSubscribed || !subscriptionTier) {
    return false;
  }

  const featureAccess = FEATURE_ACCESS[featureName];
  if (!featureAccess) {
    return false;
  }

  return featureAccess.has(subscriptionTier);
};
