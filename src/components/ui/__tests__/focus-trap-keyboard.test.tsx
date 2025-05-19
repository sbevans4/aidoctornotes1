
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FocusTrap } from '../focus-trap';
import { pressTab, pressEscape } from '@/utils/test-utils/keyboard-navigation';

describe('FocusTrap Keyboard Navigation', () => {
  it('maintains focus within trap when tabbing forward from last element', () => {
    render(
      <FocusTrap active={true}>
        <button>First</button>
        <button>Second</button>
        <button>Third</button>
      </FocusTrap>
    );
    
    const buttons = screen.getAllByRole('button');
    
    // First button should be focused initially
    expect(document.activeElement).toBe(buttons[0]);
    
    // Tab to second button
    pressTab();
    expect(document.activeElement).toBe(buttons[1]);
    
    // Tab to third button
    pressTab();
    expect(document.activeElement).toBe(buttons[2]);
    
    // Tab again should cycle back to first button
    pressTab();
    expect(document.activeElement).toBe(buttons[0]);
  });
  
  it('maintains focus within trap when tabbing backward from first element', () => {
    render(
      <FocusTrap active={true}>
        <button>First</button>
        <button>Second</button>
        <button>Third</button>
      </FocusTrap>
    );
    
    const buttons = screen.getAllByRole('button');
    
    // First button should be focused initially
    expect(document.activeElement).toBe(buttons[0]);
    
    // Shift+Tab should cycle to the last button
    pressTab(1, true);
    expect(document.activeElement).toBe(buttons[2]);
    
    // Shift+Tab again should go to middle button
    pressTab(1, true);
    expect(document.activeElement).toBe(buttons[1]);
  });
  
  it('calls onEscape callback when Escape key is pressed', () => {
    const onEscapeMock = vi.fn();
    
    render(
      <FocusTrap active={true} onEscape={onEscapeMock}>
        <button>Trapped Button</button>
      </FocusTrap>
    );
    
    pressEscape();
    expect(onEscapeMock).toHaveBeenCalledTimes(1);
  });
  
  it('handles autofocus property correctly', () => {
    render(
      <FocusTrap active={true} autoFocus={false}>
        <button>First</button>
        <button>Second</button>
      </FocusTrap>
    );
    
    // Without autoFocus, no element should be focused automatically
    expect(document.activeElement).not.toBe(screen.getByText('First'));
    
    // But trap should still work when tabbing
    pressTab();
    expect(document.activeElement).toBe(screen.getByText('First'));
  });
});
