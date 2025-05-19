
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReferralBanner } from '../ReferralBanner';
import { describe, it, expect } from 'vitest';

describe('ReferralBanner Component', () => {
  it('renders null when no discount is provided', () => {
    const { container } = render(<ReferralBanner />);
    expect(container.firstChild).toBeNull();
  });

  it('displays the discount percentage when provided', () => {
    render(<ReferralBanner discount={20} />);
    expect(screen.getByText(/20% off any plan/i)).toBeInTheDocument();
  });

  it('shows the expiry date when provided', () => {
    const date = new Date();
    date.setMonth(date.getMonth() + 3); // 3 months in the future
    
    render(<ReferralBanner discount={15} expiryDate={date.toISOString()} />);
    
    const expiryDateText = screen.getByText(/valid until/i);
    expect(expiryDateText).toBeInTheDocument();
  });

  it('shows referral code when provided', () => {
    render(<ReferralBanner discount={10} referralCode="ABC123" />);
    expect(screen.getByText(/Your referral code:/i)).toBeInTheDocument();
    expect(screen.getByText('ABC123')).toBeInTheDocument();
  });

  it('can be dismissed', () => {
    render(<ReferralBanner discount={15} />);
    
    // Banner should be visible initially
    expect(screen.getByText(/Special Discount Applied!/i)).toBeInTheDocument();
    
    // Click the dismiss button (X icon)
    const dismissButton = screen.getByLabelText('Dismiss');
    fireEvent.click(dismissButton);
    
    // Banner should be hidden after dismissal
    expect(screen.queryByText(/Special Discount Applied!/i)).not.toBeInTheDocument();
  });

  it('has a link to view subscription plans', () => {
    render(<ReferralBanner discount={15} />);
    const link = screen.getByText(/View subscription plans/i);
    expect(link).toHaveAttribute('href', '/subscription-plans');
  });

  it('has a link to refer more colleagues', () => {
    render(<ReferralBanner discount={15} />);
    const link = screen.getByText(/Refer more colleagues/i);
    expect(link).toBeInTheDocument();
  });
});
