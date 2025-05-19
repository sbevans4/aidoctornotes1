
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { validateEmail, isNetworkError, formatAuthError } from "@/utils/formValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Email validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setNetworkError(null);
    
    try {
      // Email validation
      const emailValidation = validateEmail(values.email);
      if (!emailValidation.valid) {
        form.setError("email", { message: emailValidation.message });
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      setIsSubmitted(true);
      toast({
        title: "Password reset email sent",
        description: "Please check your email for a password reset link.",
      });
    } catch (error: any) {
      if (isNetworkError(error)) {
        setNetworkError("No internet connection. Please check your network and try again.");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: formatAuthError(error),
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setNetworkError(null);
    setRetryCount(prevCount => prevCount + 1);
    const email = form.getValues("email");
    if (email) {
      form.handleSubmit(onSubmit)();
    }
  };

  const handleResendLink = () => {
    form.reset();
    setIsSubmitted(false);
  };

  return (
    <div className="container mx-auto py-16 max-w-md">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center mb-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/auth")}
              className="mr-2 p-0 h-auto"
              aria-label="Back to login"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl text-center flex-1">Reset Your Password</CardTitle>
          </div>
          <CardDescription className="text-center">
            {isSubmitted 
              ? "Check your email for a reset link" 
              : "Enter your email address and we'll send you a password reset link"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {networkError && (
            <Alert variant="destructive" className="mb-4" role="alert">
              <AlertDescription>
                {networkError}
                <Button 
                  variant="link" 
                  onClick={handleRetry}
                  className="p-0 h-auto ml-2 underline"
                  disabled={isLoading}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
        
          {isSubmitted ? (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <MailCheck className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-center text-sm text-gray-600">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
              <div className="space-y-2 w-full">
                <Button 
                  onClick={handleResendLink} 
                  className="w-full"
                  variant="outline"
                >
                  Need a new link? Try again
                </Button>
                <Button 
                  onClick={() => navigate("/auth")} 
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          ) : (
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4"
                aria-label="Password reset request form"
                key={`forgot-password-form-${retryCount}`}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="email" className="text-foreground">
                        Email <span className="text-red-500" aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          {...field}
                          ref={emailInputRef}
                          disabled={isLoading}
                          aria-required="true"
                          aria-describedby="email-error"
                          className="bg-background"
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage id="email-error" aria-live="polite" />
                    </FormItem>
                  )}
                />
                <div className="pt-2 space-y-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={() => navigate("/auth")} 
                    className="w-full"
                    disabled={isLoading}
                  >
                    Back to Login
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
