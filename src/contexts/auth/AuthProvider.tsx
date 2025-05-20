
import React, { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { SubscriptionTier } from "@/hooks/useSubscription";
import { AuthContext } from "./AuthContext";
import { UserProfile } from "./types";
import { checkFeatureAccess } from "./featureAccess";

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
    return checkFeatureAccess(
      featureName,
      subscriptionStatus.tier,
      subscriptionStatus.isSubscribed
    );
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

  // Add logout as an alias to signOut for backward compatibility
  const logout = signOut;

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
        logout, 
        checkHasFeature,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
