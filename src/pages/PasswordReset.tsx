
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, AlertTriangle, ArrowLeft, Lock } from "lucide-react";
import { validatePassword, isNetworkError, formatAuthError } from "@/utils/formValidation";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Password schema with strong requirements
const passwordResetSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordResetFormValues = z.infer<typeof passwordResetSchema>;

export default function PasswordReset() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get the access token from the URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  
  useEffect(() => {
    // Set the session if we have all the required tokens
    const setSession = async () => {
      if (accessToken && refreshToken) {
        try {
          setTokenError(null);
          
          // Set the session with the provided tokens
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) {
            setTokenError("This password reset link is invalid or has expired. Please request a new link.");
            console.error("Error setting session:", error);
          }
        } catch (error) {
          console.error("Error in session setup:", error);
          setTokenError("An error occurred while processing your request. Please try again.");
        }
      } else {
        // If no tokens are provided, this might not be a valid reset link
        setTokenError("Invalid password reset link. Please request a new password reset link.");
      }
    };
    
    setSession();
  }, [accessToken, refreshToken]);

  // Focus password input when component mounts
  useEffect(() => {
    if (passwordInputRef.current && !tokenError) {
      passwordInputRef.current.focus();
    }
  }, [tokenError]);

  const form = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleRetry = () => {
    setNetworkError(null);
    setRetryCount(prevCount => prevCount + 1);
    form.handleSubmit(onSubmit)();
  };

  const onSubmit = async (values: PasswordResetFormValues) => {
    setIsLoading(true);
    setNetworkError(null);
    
    try {
      // Validate password strength
      const passwordValidation = validatePassword(values.password);
      if (!passwordValidation.valid) {
        form.setError("password", { message: passwordValidation.message });
        setIsLoading(false);
        return;
      }
      
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      
      if (error) throw error;
      
      setIsComplete(true);
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/auth", { replace: true });
      }, 3000);
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

  if (tokenError) {
    return (
      <div className="container mx-auto py-16 max-w-md">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Password Reset</CardTitle>
            <CardDescription className="text-center">
              There was a problem with your reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-amber-100 p-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-center text-sm text-gray-600">
              {tokenError}
            </p>
            <Button 
              onClick={() => navigate("/auth/forgot-password")}
              className="w-full"
            >
              Request New Reset Link
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/auth")}
              className="w-full"
            >
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!accessToken || !refreshToken) {
    return (
      <div className="container mx-auto py-16 max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Password Reset</CardTitle>
            <CardDescription className="text-center">
              Loading password reset...
            </CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
            {isComplete 
              ? "Your password has been reset successfully" 
              : "Please enter a new password"}
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
        
          {isComplete ? (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-center text-sm text-gray-600">
                Your password has been successfully updated. Redirecting you to login...
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="space-y-4"
                aria-label="Password reset form"
                key={`password-reset-form-${retryCount}`}
              >
                <div className="bg-blue-50 p-3 rounded-md mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm text-blue-700">
                    Create a secure password that you don't use on other sites
                  </p>
                </div>
              
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">
                        New Password <span className="text-red-500" aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="password"
                          type="password"
                          placeholder="Enter a new password"
                          ref={passwordInputRef}
                          {...field}
                          disabled={isLoading}
                          aria-required="true"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                      <div className="text-xs text-muted-foreground mt-1">
                        Password must be at least 8 characters with one number and one special character.
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="confirmPassword">
                        Confirm Password <span className="text-red-500" aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm your new password"
                          {...field}
                          disabled={isLoading}
                          aria-required="true"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                    aria-busy={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                        Resetting Password...
                      </>
                    ) : (
                      "Reset Password"
                    )}
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
