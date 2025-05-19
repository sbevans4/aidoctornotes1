
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail, isNetworkError, formatAuthError } from "@/utils/formValidation";

// Validation schema for contact form with enhanced validation messages
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name cannot exceed 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  organization: z.string().optional(),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(200, "Subject cannot exceed 200 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000, "Message cannot exceed 2000 characters"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with enhanced validation
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

  // Focus name input on mount for better UX
  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  // Handle form submission
  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    setNetworkError(null);
    
    try {
      // Validate email format
      const emailValidation = validateEmail(values.email);
      if (!emailValidation.valid) {
        form.setError("email", { message: emailValidation.message });
        setIsSubmitting(false);
        return;
      }

      // Submit to Supabase
      const { error } = await supabase
        .from('contact_submissions')
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone || null,
            organization: values.organization || null,
            subject: values.subject,
            message: values.message,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
    } catch (error: any) {
      if (isNetworkError(error)) {
        setNetworkError("No internet connection. Please check your network and try again.");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: formatAuthError(error) || "Failed to send your message. Please try again.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setIsSubmitted(false);
  };

  return (
    <div className="space-y-6">
      {networkError && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertDescription>{networkError}</AlertDescription>
        </Alert>
      )}
      
      {isSubmitted ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-bold">Thank You!</h3>
            <p className="text-gray-600">
              Your message has been successfully sent. We'll get back to you as soon as possible.
            </p>
            <Button 
              onClick={handleReset} 
              className="mt-4"
              aria-label="Send another message"
            >
              Send Another Message
            </Button>
          </div>
        </div>
      ) : (
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6"
            aria-labelledby="contact-form-heading"
          >
            <h2 id="contact-form-heading" className="sr-only">Contact Form</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="name">
                      Name <span className="text-red-500" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        ref={nameInputRef}
                        disabled={isSubmitting}
                        aria-required="true"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email">
                      Email <span className="text-red-500" aria-hidden="true">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        disabled={isSubmitting}
                        aria-required="true"
                        aria-describedby="email-error"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage id="email-error" aria-live="polite" />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="phone">Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(123) 456-7890"
                        disabled={isSubmitting}
                        aria-describedby="phone-description"
                        {...field}
                      />
                    </FormControl>
                    <p id="phone-description" className="text-xs text-gray-500">Optional</p>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="organization">Organization</FormLabel>
                    <FormControl>
                      <Input
                        id="organization"
                        placeholder="Your organization or practice"
                        disabled={isSubmitting}
                        aria-describedby="org-description"
                        {...field}
                      />
                    </FormControl>
                    <p id="org-description" className="text-xs text-gray-500">Optional</p>
                    <FormMessage aria-live="polite" />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="subject">
                    Subject <span className="text-red-500" aria-hidden="true">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="subject"
                      placeholder="How can we help you?"
                      disabled={isSubmitting}
                      aria-required="true"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="message">
                    Message <span className="text-red-500" aria-hidden="true">*</span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      id="message"
                      placeholder="Tell us more about your inquiry..."
                      className="min-h-[150px] resize-y"
                      disabled={isSubmitting}
                      aria-required="true"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage aria-live="polite" />
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full md:w-auto"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  <span>Sending...</span>
                </>
              ) : (
                "Send Message"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
