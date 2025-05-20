
import { User, Session } from "@supabase/supabase-js";
import { SubscriptionTier } from "@/hooks/useSubscription";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  has_used_trial: boolean;
  purchase_date?: string | null;
  refund_requested: boolean;
  refund_request_date?: string | null;
  created_at?: string;
  updated_at?: string;
  account_type?: string;
  practice_name?: string;
  specialty?: string;
  settings?: Record<string, any>;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  tier: SubscriptionTier | null;
  expiresAt: Date | null;
}

export interface AuthContextProps {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  subscriptionStatus: {
    isSubscribed: boolean;
    tier: SubscriptionTier | null;
    expiresAt: Date | null;
  };
  signOut: () => Promise<void>;
  logout: () => Promise<void>;
  checkHasFeature: (featureName: string) => boolean;
  refreshProfile: () => Promise<void>;
}
