
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ErrorBoundary } from '../error-boundary';

// Mock component that throws an error
const ThrowError = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  // Suppress console errors for clean test output
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child component</div>
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
  
  it('renders error UI when child throws an error', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/Test error/)).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    expect(screen.getByText('Go to Homepage')).toBeInTheDocument();
  });
  
  it('renders custom fallback when provided', () => {
    const customFallback = <div data-testid="custom-fallback">Custom fallback</div>;
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError />
      </ErrorBoundary>
    );
    
    expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
  });
  
  it('resets the error state when retry button is clicked', () => {
    let shouldThrow = true;
    const onResetMock = vi.fn(() => {
      shouldThrow = false;
    });
    
    const { rerender } = render(
      <ErrorBoundary onReset={onResetMock}>
        <ThrowError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    );
    
    // Initially shows error
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    
    // Click try again button
    fireEvent.click(screen.getByText('Try Again'));
    
    // onReset should be called and shouldThrow should be false now
    expect(onResetMock).toHaveBeenCalled();
    
    // Re-render with the updated shouldThrow value
    rerender(
      <ErrorBoundary onReset={onResetMock}>
        <ThrowError shouldThrow={shouldThrow} />
      </ErrorBoundary>
    );
    
    // Should now show the component instead of the error
    expect(screen.queryByText('Something went wrong')).not.toBeInTheDocument();
  });
});
