
import { useState } from "react";
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

  const resetForm = () => {
    form.reset();
    setIsSubmitted(false);
    setNetworkError(null);
  };

  const retrySubmit = (submitFn: () => Promise<void>) => {
    setNetworkError(null);
    setAttemptCount(prev => prev + 1);
    submitFn();
  };

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
    schema: contactFormSchema,
  };
};
