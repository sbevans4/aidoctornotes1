
import React, { useRef, useEffect } from 'react';

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  returnFocus?: boolean;
  autoFocus?: boolean;
  onEscape?: () => void;
}

const FOCUSABLE_ELEMENTS = [
  'a[href]:not([tabindex="-1"])',
  'button:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]:not([tabindex="-1"])'
].join(',');

export function FocusTrap({ 
  children, 
  active = true, 
  returnFocus = true,
  autoFocus = true,
  onEscape
}: FocusTrapProps) {
  const trapRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);

  // Save the currently focused element when trap becomes active
  useEffect(() => {
    if (active && returnFocus) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
    }

    return () => {
      // Return focus when component unmounts
      if (returnFocus && lastFocusedElement.current && document.body.contains(lastFocusedElement.current)) {
        lastFocusedElement.current.focus();
      }
    };
  }, [active, returnFocus]);

  // Handle focus trap logic
  useEffect(() => {
    if (!active || !trapRef.current) return;

    const trapEl = trapRef.current;
    const focusableEls = Array.from(
      trapEl.querySelectorAll(FOCUSABLE_ELEMENTS)
    ) as HTMLElement[];
    
    // If no focusable elements found, add the trap itself to allow keyboard interaction
    if (focusableEls.length === 0) {
      focusableEls.push(trapEl);
      trapEl.setAttribute('tabindex', '0');
    }
    
    const firstFocusable = focusableEls[0];
    const lastFocusable = focusableEls[focusableEls.length - 1];

    // Auto-focus the first focusable element if autoFocus is enabled
    if (autoFocus && firstFocusable && !trapEl.contains(document.activeElement)) {
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
      
      // Handle Escape to close if onEscape callback provided
      if (e.key === 'Escape' && onEscape) {
        e.preventDefault();
        onEscape();
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Remove tabindex if it was added dynamically
      if (trapEl.getAttribute('tabindex') === '0') {
        trapEl.removeAttribute('tabindex');
      }
    };
  }, [active, autoFocus, onEscape]);

  return (
    <div 
      ref={trapRef} 
      className="outline-none" 
      tabIndex={-1}
      role="region"
      aria-label="Modal content"
    >
      {children}
    </div>
  );
}

export default FocusTrap;
