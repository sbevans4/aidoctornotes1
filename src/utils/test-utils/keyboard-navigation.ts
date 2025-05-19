
import { fireEvent } from '@testing-library/react';

/**
 * Simulates pressing the Tab key to navigate through focusable elements
 * 
 * @param times - Number of Tab presses to simulate
 * @param shiftKey - Whether to hold down Shift key (reverse tabbing)
 * @returns The currently focused element after tabbing
 */
export const pressTab = (times = 1, shiftKey = false): Element | null => {
  for (let i = 0; i < times; i++) {
    fireEvent.keyDown(document.activeElement || document.body, {
      key: 'Tab',
      code: 'Tab',
      shiftKey,
      bubbles: true,
    });
  }
  return document.activeElement;
};

/**
 * Simulates pressing the Enter key on the currently focused element
 */
export const pressEnter = (): void => {
  fireEvent.keyDown(document.activeElement || document.body, {
    key: 'Enter',
    code: 'Enter',
    bubbles: true,
  });
};

/**
 * Simulates pressing the Escape key
 */
export const pressEscape = (): void => {
  fireEvent.keyDown(document.activeElement || document.body, {
    key: 'Escape',
    code: 'Escape',
    bubbles: true,
  });
};

/**
 * Simulates pressing the arrow keys
 */
export const pressArrow = (direction: 'up' | 'down' | 'left' | 'right'): void => {
  const key = `Arrow${direction.charAt(0).toUpperCase() + direction.slice(1)}`;
  fireEvent.keyDown(document.activeElement || document.body, {
    key,
    code: key,
    bubbles: true,
  });
};

/**
 * Tests that all interactive elements in a container are keyboard navigable
 * 
 * @param container - The container element to test within
 * @returns Array of elements that were focused during tabbing
 */
export const testKeyboardNavigation = (container: HTMLElement): HTMLElement[] => {
  const focusedElements: HTMLElement[] = [];
  
  // Find all potentially focusable elements
  const focusableSelectors = [
    'a[href]:not([tabindex="-1"])',
    'button:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
    '[contentEditable=true]:not([tabindex="-1"])'
  ].join(',');
  
  const potentiallyFocusableElements = container.querySelectorAll(focusableSelectors);
  
  // Reset focus to the start of the document
  document.body.focus();
  
  // Tab through all elements
  for (let i = 0; i < potentiallyFocusableElements.length + 2; i++) {
    pressTab();
    
    if (document.activeElement && 
        document.activeElement !== document.body && 
        container.contains(document.activeElement as HTMLElement)) {
      focusedElements.push(document.activeElement as HTMLElement);
    }
  }
  
  return focusedElements;
};
