
import React, { Suspense } from 'react';

export function lazyWithFallback<T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  FallbackComponent: React.ComponentType<any> = () => null
) {
  const LazyComponent = React.lazy(importFn);
  
  return (props: React.ComponentProps<T>) => (
    <Suspense fallback={<FallbackComponent />}>
      <LazyComponent {...props} />
    </Suspense>
  );
}
