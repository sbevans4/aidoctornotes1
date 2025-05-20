
import React from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';

interface OfflineNotificationProps {
  onRetry?: () => void;
  errorMessage?: string;
  isError?: boolean;
}

export function OfflineNotification({ onRetry, errorMessage, isError = false }: OfflineNotificationProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };
  
  return (
    <motion.div 
      className="min-h-[50vh] flex items-center justify-center bg-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-md w-full">
        <Alert variant={isError ? "destructive" : "default"} className="mb-6">
          <div className="flex items-center gap-3">
            {isError ? (
              <AlertCircle className="h-5 w-5" aria-hidden="true" />
            ) : (
              <WifiOff className="h-5 w-5" aria-hidden="true" />
            )}
            <div>
              <h3 className="font-medium">{isError ? "Error" : "You're offline"}</h3>
              <AlertDescription className="mt-1">
                {errorMessage || "Please check your internet connection and try again."}
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
          {isError ? "Try Again" : "Retry Connection"}
        </Button>
      </div>
    </motion.div>
  );
}
