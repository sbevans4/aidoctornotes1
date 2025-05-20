
import React, { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { OfflineNotification } from "@/components/ui/offline-notification";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useAppLoading } from "@/hooks/use-app-loading";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const isOnline = useNetworkStatus();
  const { isLoading, loadingProgress } = useAppLoading();

  // Loading screen
  if (isLoading) {
    return <LoadingScreen loadingProgress={loadingProgress} />;
  }

  // Offline notification
  if (!isOnline) {
    return <OfflineNotification />;
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ErrorBoundary>
  );
}
