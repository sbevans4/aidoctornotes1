
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FocusTrap from '../focus-trap';

describe('FocusTrap', () => {
  it('renders children correctly', () => {
    render(
      <FocusTrap>
        <div data-testid="child">Trapped content</div>
      </FocusTrap>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
  
  it('maintains focus within the trap when active', () => {
    render(
      <FocusTrap active={true}>
        <button>First Button</button>
        <button>Middle Button</button>
        <button>Last Button</button>
      </FocusTrap>
    );
    
    const buttons = screen.getAllByRole('button');
    const firstButton = buttons[0];
    const lastButton = buttons[buttons.length - 1];
    
    // Focus should automatically go to the first button
    expect(document.activeElement).toBe(firstButton);
    
    // Tab from the last button should loop to the first
    lastButton.focus();
    fireEvent.keyDown(lastButton, { key: 'Tab', code: 'Tab' });
    expect(document.activeElement).toBe(firstButton);
    
    // Shift+Tab from the first button should loop to the last
    fireEvent.keyDown(firstButton, { key: 'Tab', code: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(lastButton);
  });
  
  it('does nothing when not active', () => {
    render(
      <FocusTrap active={false}>
        <button>Button in inactive trap</button>
      </FocusTrap>
    );
    
    const button = screen.getByRole('button');
    // Focus should not automatically move to the button
    expect(document.activeElement).not.toBe(button);
  });
  
  it('calls onEscape when Escape key is pressed', () => {
    const onEscapeMock = vi.fn();
    
    render(
      <FocusTrap active={true} onEscape={onEscapeMock}>
        <button>Trapped Button</button>
      </FocusTrap>
    );
    
    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });
    
    expect(onEscapeMock).toHaveBeenCalled();
  });
  
  it('handles case with no focusable elements', () => {
    render(
      <FocusTrap active={true}>
        <div>No focusable elements here</div>
      </FocusTrap>
    );
    
    // The trap itself should be focusable in this case
    const trap = screen.getByRole('region');
    expect(document.activeElement).toBe(trap);
  });
});
