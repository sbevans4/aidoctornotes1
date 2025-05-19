
import React, { ReactNode } from "react";

interface MobileResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function MobileResponsiveWrapper({ 
  children, 
  className = "",
  fullWidth = false
}: MobileResponsiveWrapperProps) {
  // Base classes that provide responsive padding
  const baseClasses = "px-4 sm:px-6 md:px-8 mx-auto";
  
  // Width classes that change based on screen size
  const widthClasses = fullWidth 
    ? "max-w-full" 
    : "max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl";
  
  return (
    <div className={`
      ${baseClasses}
      ${widthClasses}
      ${className}
    `}>
      {children}
    </div>
  );
}
