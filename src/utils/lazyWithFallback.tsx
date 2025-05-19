
import { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingFallbackProps {
  height?: string | number;
  width?: string | number;
  className?: string;
}

/**
 * Default loading fallback component using Skeleton
 */
export const DefaultLoadingFallback = ({ 
  height = '100%', 
  width = '100%',
  className = 'min-h-[200px] rounded-md'
}: LoadingFallbackProps) => (
  <div className="p-4">
    <Skeleton 
      style={{ height, width }} 
      className={className}
    />
  </div>
);

/**
 * Custom error fallback component
 */
export const DefaultErrorFallback = () => (
  <div className="p-4 text-center">
    <div className="rounded-full bg-red-100 p-3 mx-auto w-12 h-12 flex items-center justify-center mb-2">
      <span className="text-red-600 text-xl">!</span>
    </div>
    <h3 className="font-medium text-base mb-1">Failed to load component</h3>
    <p className="text-sm text-gray-500">Please try refreshing the page</p>
  </div>
);

/**
 * Utility function to create a lazily loaded component with custom loading and error states
 * 
 * @param importFn - Dynamic import function for the component
 * @param LoadingComponent - Optional custom loading component
 * @returns Lazily loaded component wrapped in Suspense
 */
export function lazyWithFallback<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  LoadingComponent: React.ComponentType<any> = DefaultLoadingFallback
) {
  const LazyComponent = lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<LoadingComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
