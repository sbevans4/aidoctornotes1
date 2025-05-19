
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { validateEmail, validatePassword, isNetworkError, formatAuthError } from "@/utils/formValidation";

// Schema for sign in validation with enhanced validation
const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

export function SignInForm() {
  const [loading, setLoading] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Initialize form with validation schema
  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Focus email input on mount
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const handleRetry = () => {
    setNetworkError(null);
    setRetryCount(prevCount => prevCount + 1);
    form.handleSubmit(handleSignIn)();
  };

  const handleSignIn = async (values: SignInFormValues) => {
    setLoading(true);
    setNetworkError(null);
    
    try {
      // Validate email format
      const emailValidation = validateEmail(values.email);
      if (!emailValidation.valid) {
        form.setError("email", { message: emailValidation.message });
        setLoading(false);
        return;
      }

      const { error, data } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        // Redirect to verification page
        navigate("/auth/verify");
        return;
      }

      toast({
        title: "Welcome back",
        description: "You've successfully signed in.",
      });

      navigate("/medical-documentation");
    } catch (error: any) {
      // Handle specific error cases with user-friendly messages
      if (isNetworkError(error)) {
        setNetworkError("No internet connection. Please check your network and try again.");
      } else if (error.message && error.message.includes("Invalid login")) {
        form.setError("email", { message: "Invalid email or password" });
        form.setError("password", { message: "Invalid email or password" });
      } else {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: formatAuthError(error),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTestSignIn = async () => {
    setLoading(true);
    setNetworkError(null);
    
    try {
      const testEmail = "dr.note.tester@example.com";
      const testPassword = "DrSupportTrial2025!";
      
      const { error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      });

      if (error) throw error;

      toast({
        title: "Test account accessed",
        description: "You're now signed in as DR Note Tester",
      });
      
      navigate("/medical-documentation");
    } catch (error: any) {
      if (isNetworkError(error)) {
        setNetworkError("No internet connection. Please check your network and try again.");
      } else {
        toast({
          variant: "destructive",
          title: "Demo Access Failed",
          description: formatAuthError(error),
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    const email = form.getValues("email");
    if (email) {
      navigate(`/auth/forgot-password?email=${encodeURIComponent(email)}`);
    } else {
      navigate("/auth/forgot-password");
    }
  };

  return (
    <div>
      {networkError && (
        <Alert variant="destructive" className="mb-4" role="alert">
          <AlertDescription>
            {networkError}
            <Button 
              variant="link" 
              onClick={handleRetry}
              className="p-0 h-auto ml-2 underline"
              disabled={loading}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(handleSignIn)} 
          className="space-y-4"
          aria-label="Sign in form"
          key={`sign-in-form-${retryCount}`}
        >
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
                    autoComplete="email"
                    disabled={loading}
                    aria-required="true"
                    ref={emailInputRef}
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const passwordField = document.getElementById('password');
                        if (passwordField) {
                          passwordField.focus();
                        }
                      }
                    }}
                  />
                </FormControl>
                <FormMessage aria-live="polite" />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center">
                  <FormLabel htmlFor="password">
                    Password <span className="text-red-500" aria-hidden="true">*</span>
                  </FormLabel>
                  <Button 
                    type="button"
                    variant="link" 
                    className="text-xs p-0 h-auto"
                    onClick={handleForgotPassword}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleForgotPassword();
                      }
                    }}
                  >
                    Forgot Password?
                  </Button>
                </div>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    disabled={loading}
                    aria-required="true"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        form.handleSubmit(handleSignIn)();
                      }
                    }}
                  />
                </FormControl>
                <FormMessage aria-live="polite" />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
            aria-busy={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
      </Form>
      
      <div className="relative mt-4">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or</span>
        </div>
      </div>
      
      <Button 
        type="button"
        variant="outline" 
        className="w-full mt-4" 
        onClick={handleTestSignIn}
        disabled={loading}
        aria-label="Sign in with demo account"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
            Loading...
          </>
        ) : (
          "Demo Account Access"
        )}
      </Button>
    </div>
  );
}
