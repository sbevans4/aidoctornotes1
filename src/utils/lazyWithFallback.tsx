
import React, { Suspense, lazy } from 'react';

// Default loading fallback component
export const DefaultLoadingFallback = () => (
  <div className="w-full h-screen flex items-center justify-center p-4">
    <div className="animate-pulse text-primary flex flex-col items-center max-w-md mx-auto">
      <div className="h-10 w-10 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin mb-3" 
           role="status" aria-label="Loading content">
      </div>
      <p className="text-base" aria-live="polite">Loading...</p>
    </div>
  </div>
);

// Helper function to create a lazy-loaded component with custom fallback
export function lazyWithFallback<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  FallbackComponent: React.ComponentType = DefaultLoadingFallback
) {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>): JSX.Element => (
    <Suspense fallback={<FallbackComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
