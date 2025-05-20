
import { SubscriptionTier } from "@/hooks/useSubscription";

interface FeatureMap {
  [key: string]: {
    tiers: SubscriptionTier[];
    fallbackAllowed: boolean;
  };
}

// Feature map to control access based on subscription tiers
const featureMap: FeatureMap = {
  // Medical documentation features
  "medical_documentation": {
    tiers: ["basic", "standard", "professional", "unlimited", "enterprise"],
    fallbackAllowed: true // Free trial allows this
  },
  "voice_recording": {
    tiers: ["basic", "standard", "professional", "unlimited", "enterprise"],
    fallbackAllowed: true
  },
  "soap_generation": {
    tiers: ["basic", "standard", "professional", "unlimited", "enterprise"],
    fallbackAllowed: true
  },
  
  // Advanced features
  "procedure_code_suggestion": {
    tiers: ["standard", "professional", "unlimited", "enterprise"],
    fallbackAllowed: false
  },
  "bulk_export": {
    tiers: ["professional", "unlimited", "enterprise"],
    fallbackAllowed: false
  },
  "image_analysis": {
    tiers: ["image_analysis", "enterprise"],
    fallbackAllowed: false
  },
  "team_collaboration": {
    tiers: ["professional", "unlimited", "enterprise"],
    fallbackAllowed: false
  },
  
  // Limit-based features
  "unlimited_notes": {
    tiers: ["unlimited", "enterprise"],
    fallbackAllowed: false
  },
  "priority_support": {
    tiers: ["unlimited", "enterprise"],
    fallbackAllowed: false
  },
  "white_labeling": {
    tiers: ["enterprise"],
    fallbackAllowed: false
  }
};

/**
 * Checks if a user has access to a specific feature based on subscription tier
 */
export function checkFeatureAccess(
  featureName: string,
  subscriptionTier: SubscriptionTier | null,
  isSubscribed: boolean
): boolean {
  // If the feature doesn't exist in the map, default to not allowed
  if (!featureMap[featureName]) {
    console.warn(`Feature "${featureName}" not found in feature map`);
    return false;
  }
  
  // If the user is not subscribed, check if fallback access is allowed
  if (!isSubscribed) {
    return featureMap[featureName].fallbackAllowed;
  }
  
  // If the user has a subscription, check if their tier has access
  if (subscriptionTier && featureMap[featureName].tiers.includes(subscriptionTier)) {
    return true;
  }
  
  return false;
}

/**
 * Get a list of all features a user has access to
 */
export function getUserFeatures(
  subscriptionTier: SubscriptionTier | null,
  isSubscribed: boolean
): string[] {
  return Object.keys(featureMap).filter(feature => 
    checkFeatureAccess(feature, subscriptionTier, isSubscribed)
  );
}
