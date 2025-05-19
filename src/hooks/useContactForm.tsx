
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define the form schema using Zod
const contactFormSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export const useContactForm = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Call the Supabase Edge Function for the contact form
      const { data: response, error } = await supabase.functions.invoke("contact-form", {
        body: data,
        method: "POST",
      });
      
      if (error) {
        throw new Error(error.message || "Failed to send your message");
      }
      
      if (response.error) {
        throw new Error(
          response.details 
            ? `${response.error}: ${response.details}` 
            : response.error
        );
      }
      
      // Show success message
      toast({
        title: "Message Sent!",
        description: "Thank you for contacting us. We'll respond shortly.",
      });
      
      // Reset the form
      form.reset();
    } catch (error: any) {
      console.error("Error submitting contact form:", error);
      
      // Show error message
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: error.message || "There was a problem sending your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    onSubmit,
  };
};
