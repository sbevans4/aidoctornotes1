
import React from 'react';
import { LoadingOverlay } from './loading-overlay';

interface WithLoadingProps<T> {
  /**
   * Whether the component is in a loading state
   */
  isLoading: boolean;
  
  /**
   * Optional loading message to display
   */
  loadingMessage?: string;
  
  /**
   * Data to be passed to the component
   */
  data: T | null | undefined;
  
  /**
   * Component to render when data is available
   */
  children: (data: T) => React.ReactNode;
  
  /**
   * Component to render when no data is available (and not loading)
   */
  EmptyComponent?: React.ComponentType<any>;
  
  /**
   * Whether to use a full overlay (absolute positioning)
   */
  fullOverlay?: boolean;
  
  /**
   * Additional CSS classes for the container
   */
  className?: string;
}

/**
 * HOC that wraps a component with loading, empty, and error states
 * @example
 * <WithLoading
 *   isLoading={isLoading}
 *   data={userData}
 *   loadingMessage="Loading user profile..."
 * >
 *   {(data) => <UserProfile user={data} />}
 * </WithLoading>
 */
export function WithLoading<T>({
  isLoading,
  data,
  children,
  loadingMessage,
  EmptyComponent,
  fullOverlay = true,
  className
}: WithLoadingProps<T>) {
  // If no data and not loading, show empty state
  if (!data && !isLoading && EmptyComponent) {
    return <EmptyComponent />;
  }
  
  // If loading or has data, use LoadingOverlay
  return (
    <LoadingOverlay 
      loading={isLoading} 
      message={loadingMessage}
      fullOverlay={fullOverlay}
      className={className}
    >
      {data ? children(data) : null}
    </LoadingOverlay>
  );
}

/**
 * Higher-order component that adds loading state to a component
 */
export function withLoading<P extends object>(
  Component: React.ComponentType<P>,
  loadingProps: {
    loadingProp?: keyof P;
    dataProp?: keyof P;
    loadingMessage?: string;
    fullOverlay?: boolean;
  } = {}
) {
  const {
    loadingProp = 'isLoading',
    dataProp = 'data',
    loadingMessage = 'Loading...',
    fullOverlay = true
  } = loadingProps;
  
  return (props: P) => {
    const isLoading = props[loadingProp as keyof P] as boolean;
    const data = props[dataProp as keyof P];
    
    return (
      <LoadingOverlay 
        loading={isLoading} 
        message={loadingMessage}
        fullOverlay={fullOverlay}
      >
        <Component {...props} />
      </LoadingOverlay>
    );
  };
}

export default WithLoading;
