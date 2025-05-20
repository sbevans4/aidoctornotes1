
import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  isLoading: boolean;
  centered?: boolean;
  size?: 'small' | 'medium' | 'large';
  message?: string; // Added message prop
  fullPage?: boolean; // Added fullPage prop
  children?: React.ReactNode; // Added children prop
}

export function PageLoading({ 
  isLoading, 
  centered = false,
  size = 'medium',
  message = 'Loading page content...',
  fullPage = false,
  children
}: PageLoadingProps) {
  if (!isLoading) {
    return children ? <>{children}</> : null;
  }
  
  const getSizeClass = () => {
    switch(size) {
      case 'small': return 'h-4 w-4';
      case 'large': return 'h-12 w-12';
      default: return 'h-8 w-8';
    }
  };
  
  const sizeClass = getSizeClass();
  
  const containerClasses = [
    centered ? 'flex items-center justify-center' : '',
    fullPage ? 'min-h-screen w-full' : 'min-h-[60vh]'
  ].filter(Boolean).join(' ');
  
  return (
    <div className={containerClasses} role="status">
      <div className="flex flex-col items-center">
        <Loader2 className={`${sizeClass} animate-spin text-primary`} aria-hidden="true" />
        {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
      </div>
    </div>
  );
}
