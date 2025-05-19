
import React, { ReactNode, useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, WifiOff, RefreshCw } from "lucide-react";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  // Check for online status and simulate loading progress
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + Math.random() * 15;
        return next > 100 ? 100 : next;
      });
    }, 150);

    // Simulate initial app loading
    const timer = setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 200); // Small delay for smooth transition
    }, 800);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4">
        <div className="text-center max-w-md w-full">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary mb-4" aria-hidden="true" />
          <h2 className="text-xl font-medium mb-2">Loading AiDoctorNotes</h2>
          <p className="text-gray-500 mb-4">Preparing your medical documentation tools...</p>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${loadingProgress}%` }}
              role="progressbar"
              aria-valuenow={loadingProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
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
              <WifiOff className="h-5 w-5" aria-hidden="true" />
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
            className="w-full flex items-center justify-center gap-2"
            aria-label="Retry connection"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
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
