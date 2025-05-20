
import React from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OfflineNotificationProps {
  onRetry?: () => void;
}

export function OfflineNotification({ onRetry }: OfflineNotificationProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  return (
    <div className="min-h-[50vh] flex items-center justify-center bg-white p-4">
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
          onClick={handleRetry} 
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
