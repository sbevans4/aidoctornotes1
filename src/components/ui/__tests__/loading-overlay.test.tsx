
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingOverlay } from '../loading-overlay';

describe('LoadingOverlay', () => {
  it('renders loading state correctly', () => {
    render(<LoadingOverlay loading={true} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('renders custom loading message when provided', () => {
    render(<LoadingOverlay loading={true} message="Custom loading message" />);
    
    expect(screen.getByText('Custom loading message')).toBeInTheDocument();
  });
  
  it('renders children when not loading', () => {
    render(
      <LoadingOverlay loading={false}>
        <div data-testid="child">Content</div>
      </LoadingOverlay>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });
  
  it('renders children with overlay when loading', () => {
    render(
      <LoadingOverlay loading={true}>
        <div data-testid="child">Content</div>
      </LoadingOverlay>
    );
    
    // Both the children and the loading indicator should be present
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
  
  it('has proper accessibility attributes', () => {
    render(<LoadingOverlay loading={true} />);
    
    const status = screen.getByRole('status');
    expect(status).toHaveAttribute('aria-live', 'polite');
    expect(status).toHaveAttribute('aria-label', 'Loading content');
  });
  
  it('returns null when neither loading nor has children', () => {
    const { container } = render(<LoadingOverlay loading={false} />);
    
    expect(container.firstChild).toBeNull();
  });
});
