
import { User, Session } from "@supabase/supabase-js";
import { SubscriptionTier } from "@/hooks/useSubscription";

export interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  has_used_trial: boolean;
  purchase_date: string | null;
  refund_requested: boolean;
  refund_request_date: string | null;
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
  logout: () => Promise<void>; // Alias for backward compatibility
  checkHasFeature: (featureName: string) => boolean;
  refreshProfile: () => Promise<void>;
}
