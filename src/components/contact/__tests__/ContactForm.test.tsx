
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ContactForm from '../ContactForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

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

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the contact form correctly', () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );
    
    // Check if form fields are rendered
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });

  it('focuses the name input on mount', async () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );
    
    const nameInput = screen.getByLabelText(/Name/i);
    await waitFor(() => {
      expect(document.activeElement).toBe(nameInput);
    });
  });

  it('validates the form before submission', async () => {
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );
    
    // Submit with empty fields
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));
    
    // Check if validation errors appear
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('submits the form successfully', async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    (supabase.from as any).mockReturnValue({ insert: mockInsert });
    
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    // Fill the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'This is a test message for testing the contact form' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    // Check if the submission was successful
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'This is a test message for testing the contact form'
      })]);
      
      // Success message should be displayed
      expect(screen.getByText(/Thank You!/i)).toBeInTheDocument();
      expect(screen.getByText(/Your message has been successfully sent/i)).toBeInTheDocument();
    });
  });

  it('shows an error message when submission fails', async () => {
    // Mock supabase to return an error
    const mockError = { message: 'Database error' };
    const mockInsert = vi.fn().mockResolvedValue({ error: mockError });
    (supabase.from as any).mockReturnValue({ insert: mockInsert });
    
    // Mock toast
    const mockToast = vi.fn();
    (useToast as any).mockReturnValue({ toast: mockToast });
    
    render(
      <MemoryRouter>
        <ContactForm />
      </MemoryRouter>
    );

    // Fill the form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText(/Subject/i), { target: { value: 'Test Subject' } });
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: 'This is a test message for testing the contact form' } });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Send Message/i }));

    // Check if error handling worked
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(expect.objectContaining({
        variant: 'destructive'
      }));
    });
  });
});
