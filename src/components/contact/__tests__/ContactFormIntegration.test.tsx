
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../ContactForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import userEvent from '@testing-library/user-event';

// Mock the supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn().mockReturnValue({
      insert: vi.fn().mockReturnValue({
        error: null
      })
    })
  }
}));

// Mock the toast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn().mockReturnValue({
    toast: vi.fn()
  })
}));

describe('ContactForm Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('submits the form with valid data and shows success', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as any).mockReturnValue({ insert: mockInsert });
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    // Fill in the form with valid data
    await user.type(screen.getByLabelText(/Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Phone Number/i), '1234567890');
    await user.type(screen.getByLabelText(/Organization/i), 'Test Company');
    await user.type(screen.getByLabelText(/Subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/Message/i), 'This is a test message for testing the contact form');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Send Message/i }));

    // Verify loading state appears
    expect(screen.getByText(/Sending/i)).toBeInTheDocument();
    
    // Wait for submission process to complete
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for testing the contact form'
      })]);
    });
    
    // Check that success state is shown
    await waitFor(() => {
      expect(screen.getByText(/Thank You!/i)).toBeInTheDocument();
      expect(screen.getByText(/Your message has been successfully sent/i)).toBeInTheDocument();
    });
  });

  it('shows validation errors for invalid inputs', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    // Submit without filling in form
    await user.click(screen.getByRole('button', { name: /Send Message/i }));
    
    // Check validation errors
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('shows error message when submission fails', async () => {
    const mockError = { message: 'Database error' };
    const mockInsert = vi.fn().mockResolvedValue({ error: mockError });
    (supabase.from as any).mockReturnValue({ insert: mockInsert });
    
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({ toast: mockToast });
    
    const user = userEvent.setup();
    
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    // Fill the form
    await user.type(screen.getByLabelText(/Name/i), 'John Doe');
    await user.type(screen.getByLabelText(/Email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/Subject/i), 'Test Subject');
    await user.type(screen.getByLabelText(/Message/i), 'This is a test message for testing the contact form');
    
    // Submit the form
    await user.click(screen.getByRole('button', { name: /Send Message/i }));

    // Verify loading state appears and disappears
    expect(screen.getByText(/Sending/i)).toBeInTheDocument();
    
    // Check for error message
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        variant: 'destructive',
        title: expect.stringContaining('Error')
      }));
    });
  });

  it('properly handles focus management', async () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );
    
    // First input should be focused on mount
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText(/Name/i));
    });
    
    // Tab navigation should work correctly
    fireEvent.keyDown(screen.getByLabelText(/Name/i), { key: 'Tab' });
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText(/Email/i));
    });
    
    // Test focus on error
    const submitButton = screen.getByRole('button', { name: /Send Message/i });
    submitButton.focus();
    fireEvent.click(submitButton);
    
    // Should focus first field with error
    await waitFor(() => {
      expect(document.activeElement).toBe(screen.getByLabelText(/Name/i));
    });
  });
});
