
import { useRef, useEffect } from "react";
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
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { validateEmail, isNetworkError, formatAuthError } from "@/utils/formValidation";
import { useContactForm, ContactFormValues } from "@/hooks/useContactForm";
import { FocusTrap } from "@/components/ui/focus-trap";

export default function ContactForm() {
  const { 
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
    schema
  } = useContactForm();
  
  const nameInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Focus name input on mount for better UX
  useEffect(() => {
    if (nameInputRef.current && !isSubmitted) {
      nameInputRef.current.focus();
    }
  }, [isSubmitted]);

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

  const handleRetry = () => {
    retrySubmit(() => form.handleSubmit(onSubmit)());
  };

  return (
    <div className="space-y-6">
      {networkError && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertDescription className="flex items-center justify-between">
            <span>{networkError}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRetry}
              disabled={isSubmitting}
              className="ml-2 h-8"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {isSubmitted ? (
        <FocusTrap>
          <div className="bg-white p-6 rounded-lg shadow-md" tabIndex={-1} role="dialog" aria-labelledby="thank-you-title">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold" id="thank-you-title">Thank You!</h3>
              <p className="text-gray-600">
                Your message has been successfully sent. We'll get back to you as soon as possible.
              </p>
              <Button 
                onClick={resetForm} 
                className="mt-4"
                aria-label="Send another message"
                autoFocus
              >
                Send Another Message
              </Button>
            </div>
          </div>
        </FocusTrap>
      ) : (
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6"
            aria-labelledby="contact-form-heading"
            key={`contact-form-${attemptCount}`}
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
