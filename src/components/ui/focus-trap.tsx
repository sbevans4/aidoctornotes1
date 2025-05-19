
import React, { useRef, useEffect } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  returnFocus?: boolean;
}

const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(',');

export function FocusTrap({ children, active = true, returnFocus = true }: FocusTrapProps) {
  const trapRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Save the currently focused element when trap becomes active
    if (active && returnFocus) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
    }

    return () => {
      // Return focus when component unmounts
      if (returnFocus && lastFocusedElement.current) {
        lastFocusedElement.current.focus();
      }
    };
  }, [active, returnFocus]);

  useEffect(() => {
    if (!active || !trapRef.current) return;

    const trapEl = trapRef.current;
    const focusableEls = trapEl.querySelectorAll(FOCUSABLE_ELEMENTS);
    const firstFocusable = focusableEls[0] as HTMLElement;
    const lastFocusable = focusableEls[focusableEls.length - 1] as HTMLElement;

    // Auto-focus the first focusable element
    if (firstFocusable && !trapEl.contains(document.activeElement)) {
      firstFocusable.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Tab and Shift+Tab for focus cycling
      if (e.key === 'Tab') {
        // If Shift + Tab from first element, move to last
        if (e.shiftKey && document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable.focus();
        } 
        // If Tab from last element, move to first
        else if (!e.shiftKey && document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable.focus();
        }
      }
      
      // Handle Escape to close (if provided with a close function)
      if (e.key === 'Escape') {
        // You could call an onClose prop here
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [active]);

  return (
    <div ref={trapRef} className="outline-none" tabIndex={-1}>
      {children}
    </div>
  );
}

export default FocusTrap;
