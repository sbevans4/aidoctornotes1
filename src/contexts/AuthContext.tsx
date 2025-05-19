
import React, { createContext, useState, useEffect, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionTier } from "@/hooks/useSubscription";

interface AuthContextProps {
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
  checkHasFeature: (featureName: string) => boolean;
  refreshProfile: () => Promise<void>; // Added this function
}

interface UserProfile {
  id: string;
  full_name: string | null;
  email: string;
  has_used_trial: boolean;
  purchase_date: string | null;
  refund_requested: boolean;
  refund_request_date: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionStatus, setSubscriptionStatus] = useState({
    isSubscribed: false,
    tier: null as SubscriptionTier | null,
    expiresAt: null as Date | null,
  });
  const { toast } = useToast();

  // Feature access matrix based on subscription tier
  const FEATURE_ACCESS: Record<string, Set<SubscriptionTier>> = {
    basic_transcription: new Set(['basic', 'standard', 'unlimited', 'professional', 'image_analysis']),
    unlimited_soap_notes: new Set(['standard', 'unlimited', 'professional', 'image_analysis']),
    code_suggestions: new Set(['standard', 'unlimited', 'professional', 'image_analysis']),
    unlimited_transcription: new Set(['standard', 'unlimited', 'professional', 'image_analysis']),
    image_analysis: new Set(['unlimited', 'professional', 'image_analysis']),
    unlimited_image_analysis: new Set(['image_analysis']),
    team_accounts: new Set(['professional', 'image_analysis']),
    ehr_integration: new Set(['professional', 'image_analysis']),
  };

  useEffect(() => {
    // Set up auth state listener FIRST (before checking session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        // Important: Don't call supabase inside this callback! Just update state.
        setSession(newSession);
        setUser(newSession?.user ?? null);
      }
    );

    // THEN check for existing session
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        
        // Get session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        
        // If user is authenticated, fetch profile and subscription
        if (existingSession?.user) {
          // Get profile data
          setTimeout(async () => {
            await fetchUserProfile(existingSession.user.id);
            await fetchSubscriptionStatus(existingSession.user.id);
          }, 0);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile information
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  // Function to manually refresh the profile
  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id);
    }
  };

  // Check subscription status
  const fetchSubscriptionStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("*, subscription_plans(*)")
        .eq("user_id", userId)
        .eq("status", "active")
        .single();

      if (error && error.code !== "PGRST116") {
        throw error;
      }

      if (data) {
        setSubscriptionStatus({
          isSubscribed: true,
          tier: data.subscription_plans?.tier as SubscriptionTier ?? null,
          expiresAt: data.current_period_end ? new Date(data.current_period_end) : null,
        });
      } else {
        setSubscriptionStatus({
          isSubscribed: false,
          tier: null,
          expiresAt: null,
        });
      }
    } catch (error) {
      console.error("Error fetching subscription status:", error);
    }
  };

  // Check if the user has access to a specific feature
  const checkHasFeature = (featureName: string): boolean => {
    if (!subscriptionStatus.isSubscribed || !subscriptionStatus.tier) {
      return false;
    }

    const featureAccess = FEATURE_ACCESS[featureName];
    if (!featureAccess) {
      return false;
    }

    return featureAccess.has(subscriptionStatus.tier);
  };

  // Sign out function
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to sign out. Please try again.",
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated: !!user,
        isLoading,
        subscriptionStatus,
        signOut,
        checkHasFeature,
        refreshProfile, // Added this to the context value
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
