
import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

// Define the form schema using Zod
const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * Custom hook for managing contact form state and submission
 * This is a reusable hook that can be used across different contact forms
 */
export const useContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      organization: "",
      subject: "",
      message: "",
    },
  });

  const resetForm = useCallback(() => {
    form.reset();
    setIsSubmitted(false);
    setNetworkError(null);
  }, [form]);

  const retrySubmit = useCallback((submitFn: () => Promise<void>) => {
    setNetworkError(null);
    setAttemptCount(prev => prev + 1);
    submitFn();
  }, []);

  const handleSubmit = useCallback(async (
    values: ContactFormValues, 
    onSuccess?: () => void,
    onError?: (error: Error) => void
  ) => {
    setIsSubmitting(true);
    setNetworkError(null);
    
    try {
      // API call would go here
      
      setIsSubmitted(true);
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully. We'll get back to you soon.",
      });
      
      if (onSuccess) onSuccess();
    } catch (error) {
      setNetworkError("Failed to send message. Please try again.");
      toast({
        variant: "destructive",
        title: "Failed to send message",
        description: "There was a problem sending your message. Please try again.",
      });
      
      if (onError && error instanceof Error) onError(error);
    } finally {
      setIsSubmitting(false);
    }
  }, [toast]);

  return {
    form,
    isSubmitting,
    isSubmitted,
    networkError,
    attemptCount,
    setIsSubmitting,
    setIsSubmitted,
    setNetworkError,
    resetForm,
    retrySubmit,
    handleSubmit,
    schema: contactFormSchema,
  };
};
