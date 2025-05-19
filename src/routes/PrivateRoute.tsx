
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiresSubscription?: boolean;
  requiredFeature?: string;
}

export const PrivateRoute = ({ 
  children, 
  requiresSubscription = false,
  requiredFeature
}: PrivateRouteProps) => {
  const { isAuthenticated, isLoading, subscriptionStatus, checkHasFeature } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading your account...</p>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check if this route requires a subscription
  if (requiresSubscription && !subscriptionStatus.isSubscribed) {
    return <Navigate to="/subscription-plans" state={{ from: location }} replace />;
  }

  // Check if this route requires a specific feature
  if (requiredFeature && !checkHasFeature(requiredFeature)) {
    return <Navigate to="/subscription-plans" state={{ from: location }} replace />;
  }

  // Allow access to the protected route
  return <>{children}</>;
};
