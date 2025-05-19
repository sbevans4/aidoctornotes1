
import React from 'react';
import { PageLoading } from './page-loading';

interface WithLoadingProps<T> {
  /**
   * Loading state
   */
  isLoading: boolean;
  
  /**
   * The data that will be passed to the children
   */
  data: T | null;
  
  /**
   * Custom loading message
   */
  loadingMessage?: string;
  
  /**
   * Center loading indicator
   */
  centered?: boolean;
  
  /**
   * Render function that will be called with the data
   */
  children: (data: T) => React.ReactNode;
}

/**
 * HOC that shows a loading indicator while data is loading
 * and renders the children when data is available
 */
export function WithLoading<T>({ 
  isLoading, 
  data, 
  loadingMessage = "Loading...", 
  centered = true,
  children 
}: WithLoadingProps<T>) {
  // Show loading indicator when loading or when data is null
  if (isLoading || !data) {
    return (
      <PageLoading 
        isLoading={true} 
        message={loadingMessage}
        centered={centered}
      />
    );
  }
  
  // Render children with data
  return <>{children(data)}</>;
}

export default WithLoading;
