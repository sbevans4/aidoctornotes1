
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PageLoading } from '../page-loading';

describe('PageLoading Component', () => {
  it('renders loading state correctly', () => {
    render(<PageLoading isLoading={true} />);
    
    expect(screen.getByText('Loading page content...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
  
  it('renders custom loading message when provided', () => {
    render(<PageLoading isLoading={true} message="Custom page loading message" />);
    
    expect(screen.getByText('Custom page loading message')).toBeInTheDocument();
  });
  
  it('renders children when not loading', () => {
    render(
      <PageLoading isLoading={false}>
        <div data-testid="child">Page Content</div>
      </PageLoading>
    );
    
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText('Loading page content...')).not.toBeInTheDocument();
  });
  
  it('applies centered class when centered is true', () => {
    const { container } = render(<PageLoading isLoading={true} centered={true} />);
    
    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-center');
  });
  
  it('renders full-page loading overlay when fullPage is true', () => {
    const { container } = render(<PageLoading isLoading={true} fullPage={true} />);
    
    expect(container.firstChild).toHaveClass('min-h-screen', 'w-full');
  });
});
