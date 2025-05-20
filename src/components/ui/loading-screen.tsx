
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingScreenProps {
  loadingProgress: number;
}

export function LoadingScreen({ loadingProgress }: LoadingScreenProps) {
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
