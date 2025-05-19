
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReferralSection } from '../ReferralSection';
import { useAuth } from '@/contexts/AuthContext';
import { useReferral } from '@/hooks/useReferral';
import { useToast } from '@/components/ui/use-toast';

// Mock dependencies
jest.mock('@/contexts/AuthContext');
jest.mock('@/hooks/useReferral');
jest.mock('@/components/ui/use-toast');

describe('ReferralSection Component', () => {
  // Helper to setup mocks
  const setupMocks = ({ 
    isAuthenticated = true, 
    referralData = {}, 
    sendReferralInvite = { 
      mutateAsync: jest.fn().mockResolvedValue('Referral sent') 
    } 
  }) => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated });
    (useReferral as jest.Mock).mockReturnValue({ 
      referralData, 
      sendReferralInvite 
    });
    (useToast as jest.Mock).mockReturnValue({ 
      toast: jest.fn() 
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders sign up message when user is not authenticated', () => {
    setupMocks({ isAuthenticated: false });
    render(<ReferralSection />);
    
    expect(screen.getByText(/Sign Up To Start Referring/i)).toBeInTheDocument();
    expect(screen.queryByText(/Send an Invitation/i)).not.toBeInTheDocument();
  });

  it('renders referral UI when user is authenticated', () => {
    setupMocks({ isAuthenticated: true });
    render(<ReferralSection />);
    
    expect(screen.getByText(/Refer a Colleague, Get \$10 Off!/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Colleague's email address/i)).toBeInTheDocument();
    expect(screen.getByText(/Send Referral/i)).toBeInTheDocument();
  });

  it('shows active discount when available', () => {
    setupMocks({
      isAuthenticated: true,
      referralData: {
        activeDiscount: 20,
        expiryDate: new Date().toISOString()
      }
    });
    
    render(<ReferralSection />);
    expect(screen.getByText(/You currently have a 20% discount applied!/i)).toBeInTheDocument();
  });

  it('handles sending a referral invitation', async () => {
    const mockSendReferral = jest.fn().mockResolvedValue('Success');
    setupMocks({
      isAuthenticated: true,
      sendReferralInvite: {
        mutateAsync: mockSendReferral
      }
    });
    
    render(<ReferralSection />);
    
    const emailInput = screen.getByPlaceholderText(/Colleague's email address/i);
    const submitButton = screen.getByText(/Send Referral/i);
    
    fireEvent.change(emailInput, { target: { value: 'colleague@example.com' } });
    fireEvent.click(submitButton);
    
    expect(mockSendReferral).toHaveBeenCalledWith('colleague@example.com');
    await waitFor(() => {
      expect(mockSendReferral).toHaveBeenCalledTimes(1);
    });
  });

  it('handles copy referral link', async () => {
    // Mock clipboard API
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: mockWriteText },
      configurable: true
    });
    
    setupMocks({
      isAuthenticated: true,
      referralData: { code: 'TEST123' }
    });
    
    render(<ReferralSection />);
    
    const copyButton = screen.getByText(/Copy Referral Link/i);
    fireEvent.click(copyButton);
    
    expect(mockWriteText).toHaveBeenCalledWith(expect.stringContaining('TEST123'));
    await waitFor(() => {
      expect(mockWriteText).toHaveBeenCalledTimes(1);
    });
  });

  it('handles error when sending invitation', async () => {
    const mockToast = jest.fn();
    (useToast as jest.Mock).mockReturnValue({ toast: mockToast });
    
    const mockSendReferral = jest.fn().mockRejectedValue(new Error('Test error'));
    setupMocks({
      isAuthenticated: true,
      sendReferralInvite: {
        mutateAsync: mockSendReferral
      }
    });
    
    render(<ReferralSection />);
    
    const emailInput = screen.getByPlaceholderText(/Colleague's email address/i);
    const submitButton = screen.getByText(/Send Referral/i);
    
    fireEvent.change(emailInput, { target: { value: 'colleague@example.com' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockSendReferral).toHaveBeenCalledWith('colleague@example.com');
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        title: 'Error sending referral',
        variant: 'destructive'
      }));
    });
  });
});
