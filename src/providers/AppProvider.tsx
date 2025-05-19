
import React, { ReactNode, useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, WifiOff } from "lucide-react";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate initial app loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearTimeout(timer);
    };
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <h2 className="mt-4 text-lg font-medium">Loading AiDoctorNotes...</h2>
        </div>
      </div>
    );
  }

  // Offline notification
  if (!isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive" className="mb-6">
            <div className="flex items-center gap-3">
              <WifiOff className="h-5 w-5" />
              <div>
                <h3 className="font-medium">You're offline</h3>
                <AlertDescription className="mt-1">
                  Please check your internet connection and try again.
                </AlertDescription>
              </div>
            </div>
          </Alert>
          <Button 
            onClick={() => window.location.reload()} 
            className="w-full"
            aria-label="Retry connection"
          >
            Retry Connection
          </Button>
        </div>
      </div>
    );
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
