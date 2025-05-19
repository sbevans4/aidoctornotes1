
import { useEffect, useState } from 'react';

// Enhanced mobile detection with platform info
export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState<'web' | 'ios' | 'android'>('web');
  
  useEffect(() => {
    // Function to determine if device is mobile
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      
      // Check for mobile and tablet devices
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
      const isMobileDevice = mobileRegex.test(userAgent.toLowerCase());
      
      // Detect platform
      let detectedPlatform: 'web' | 'ios' | 'android' = 'web';
      if (isMobileDevice) {
        if (/android/i.test(userAgent)) {
          detectedPlatform = 'android';
        } else if (/iphone|ipad|ipod/i.test(userAgent)) {
          detectedPlatform = 'ios';
        }
      }
      
      setIsMobile(isMobileDevice);
      setPlatform(detectedPlatform);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events to update when browser resizes
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  return { isMobile, platform };
};

export default useMobile;
