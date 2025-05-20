
import { useState, useEffect } from 'react';

export function useAppLoading() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const next = prev + Math.random() * 15;
        return next > 100 ? 100 : next;
      });
    }, 150);

    // Simulate initial app loading
    const timer = setTimeout(() => {
      clearInterval(interval);
      setLoadingProgress(100);
      setTimeout(() => setIsLoading(false), 200); // Small delay for smooth transition
    }, 800);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return { isLoading, loadingProgress, setIsLoading };
}
