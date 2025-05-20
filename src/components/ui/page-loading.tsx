
import React from 'react';
import { Loader2 } from 'lucide-react';

interface PageLoadingProps {
  isLoading: boolean;
  centered?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function PageLoading({ 
  isLoading, 
  centered = false,
  size = 'medium' 
}: PageLoadingProps) {
  if (!isLoading) return null;
  
  const getSizeClass = () => {
    switch(size) {
      case 'small': return 'h-4 w-4';
      case 'large': return 'h-12 w-12';
      default: return 'h-8 w-8';
    }
  };
  
  const sizeClass = getSizeClass();
  
  if (centered) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className={`${sizeClass} animate-spin text-primary`} />
      </div>
    );
  }
  
  return <Loader2 className={`${sizeClass} animate-spin text-primary`} />;
}
