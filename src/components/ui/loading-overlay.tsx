
import React from 'react';
import { Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
  /**
   * Whether the loading overlay should be displayed
   */
  loading: boolean;
  
  /**
   * Optional loading message to display
   */
  message?: string;
  
  /**
   * Whether to use an absolute position that covers parent element
   */
  fullOverlay?: boolean;
  
  /**
   * Optional CSS classes
   */
  className?: string;
  
  /**
   * Child elements that will be rendered behind the loading overlay
   */
  children?: React.ReactNode;
}

/**
 * A loading overlay component that can be used to indicate loading states
 * Can be used as a wrapper or as a standalone component
 */
export function LoadingOverlay({
  loading,
  message = 'Loading...',
  fullOverlay = true,
  className,
  children
}: LoadingOverlayProps) {
  // If not loading and no children, don't render anything
  if (!loading && !children) return null;
  
  // If not loading but has children, just render the children
  if (!loading && children) return <>{children}</>;
  
  // Container classes based on props
  const containerClass = cn(
    'relative',
    className
  );
  
  // Overlay classes based on props
  const overlayClass = cn(
    'flex flex-col items-center justify-center bg-background/80 z-50 backdrop-blur-sm',
    fullOverlay ? 'absolute inset-0' : 'p-4'
  );
  
  // If used as a wrapper for content
  if (children) {
    return (
      <div className={containerClass} aria-busy={loading}>
        {children}
        
        {loading && (
          <div 
            className={overlayClass}
            role="status"
            aria-live="polite"
            aria-label="Loading content"
          >
            <Loader className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
            {message && (
              <p className="mt-2 text-sm font-medium text-foreground">{message}</p>
            )}
          </div>
        )}
      </div>
    );
  }
  
  // If used as a standalone loading indicator
  return (
    <div 
      className={cn('p-6 flex flex-col items-center justify-center', className)}
      role="status"
      aria-live="polite"
      aria-label="Loading content"
    >
      <Loader className="h-8 w-8 animate-spin text-primary" aria-hidden="true" />
      {message && (
        <p className="mt-2 text-sm font-medium text-foreground">{message}</p>
      )}
    </div>
  );
}

export default LoadingOverlay;
