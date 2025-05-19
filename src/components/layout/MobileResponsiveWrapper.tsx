
import React, { ReactNode } from "react";

interface MobileResponsiveWrapperProps {
  children: ReactNode;
  className?: string;
}

export function MobileResponsiveWrapper({ 
  children, 
  className = "" 
}: MobileResponsiveWrapperProps) {
  return (
    <div className={`
      px-4 sm:px-6 md:px-8 max-w-full 
      sm:max-w-screen-sm 
      md:max-w-screen-md 
      lg:max-w-screen-lg 
      xl:max-w-screen-xl 
      mx-auto
      ${className}
    `}>
      {children}
    </div>
  );
}
