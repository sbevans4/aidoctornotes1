
import React from 'react';
import { LoadingOverlay } from './loading-overlay';

interface PageLoadingProps {
  /**
   * Whether the page is in a loading state
   */
  isLoading: boolean;
  
  /**
   * Optional loading message to display
   */
  message?: string;
  
  /**
   * Child elements that will be rendered when not loading
   */
  children?: React.ReactNode;
  
  /**
   * Optional CSS classes
   */
  className?: string;
  
  /**
   * Center the loading indicator on the page
   */
  centered?: boolean;
  
  /**
   * Show a full-page loading overlay instead of just the indicator
   */
  fullPage?: boolean;
}

/**
 * A page-level loading component that displays a centered loading indicator
 * Can be used as a wrapper for page content or as a standalone component
 */
export function PageLoading({
  isLoading,
  message = 'Loading page content...',
  children,
  className,
  centered = true,
  fullPage = false
}: PageLoadingProps) {
  if (!isLoading && children) {
    return <>{children}</>;
  }
  
  if (fullPage) {
    return (
      <div className={`min-h-screen w-full ${centered ? 'flex items-center justify-center' : ''} ${className || ''}`}>
        <LoadingOverlay 
          loading={isLoading} 
          message={message}
          fullOverlay={false}
        />
      </div>
    );
  }
  
  return (
    <LoadingOverlay 
      loading={isLoading} 
      message={message}
      fullOverlay={false}
      className={`${centered ? 'flex items-center justify-center min-h-[200px]' : ''} ${className || ''}`}
    >
      {children}
    </LoadingOverlay>
  );
}

export default PageLoading;
