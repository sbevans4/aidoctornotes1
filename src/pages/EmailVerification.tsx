
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isNetworkError, formatAuthError } from "@/utils/formValidation";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  
  // Get the access token and other parameters from the URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");
  
  useEffect(() => {
    const verifyEmail = async () => {
      setIsVerifying(true);
      setNetworkError(null);
      
      try {
        // If this is an email verification link from Supabase
        if (type === "signup" && accessToken && refreshToken) {
          // Update the user's session
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (error) throw error;
          
          // Update the user profile if available
          if (refreshProfile) {
            await refreshProfile();
          }
          
          setIsVerified(true);
          
          toast({
            title: "Email verified",
            description: "Your email has been verified successfully.",
          });
        } else {
          throw new Error("Invalid verification link");
        }
      } catch (error: any) {
        if (isNetworkError(error)) {
          setNetworkError("No internet connection. Please check your network and try again.");
        } else {
          toast({
            variant: "destructive",
            title: "Verification failed",
            description: formatAuthError(error),
          });
        }
      } finally {
        setIsVerifying(false);
      }
    };
    
    if (accessToken && refreshToken) {
      verifyEmail();
    } else {
      setIsVerifying(false);
    }
  }, [accessToken, refreshToken, type, toast, refreshProfile, retryCount]);
  
  const handleRetry = () => {
    setNetworkError(null);
    setRetryCount(prev => prev + 1);
  };
  
  const resendVerificationEmail = async () => {
    setIsVerifying(true);
    setNetworkError(null);
    
    try {
      if (!user || !user.email) {
        throw new Error("User email not available. Please try logging in again.");
      }
      
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });
      
      if (error) throw error;
      
      toast({
        title: "Verification email sent",
        description: "Please check your email for a new verification link.",
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
      setIsVerifying(false);
    }
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
            <CardTitle className="text-2xl text-center flex-1">Email Verification</CardTitle>
          </div>
          <CardDescription className="text-center">
            {isVerifying 
              ? "Verifying your email address..." 
              : isVerified 
                ? "Your email has been verified!" 
                : "Email verification required"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {networkError && (
            <Alert variant="destructive" className="mb-4 w-full" role="alert">
              <AlertDescription>
                {networkError}
                <Button 
                  variant="link" 
                  onClick={handleRetry}
                  className="p-0 h-auto ml-2 underline"
                  disabled={isVerifying}
                >
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {isVerifying ? (
            <div className="flex flex-col items-center gap-4 py-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-center text-sm text-gray-600">
                Please wait while we verify your email...
              </p>
            </div>
          ) : isVerified ? (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-center text-sm text-gray-600">
                Your email has been verified successfully. You can now access all features of AiDoctorNotes.
              </p>
              <Button 
                onClick={() => navigate("/medical-documentation")}
                className="w-full"
              >
                Continue to Dashboard
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate("/")}
                className="w-full"
              >
                Return to Homepage
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="rounded-full bg-blue-100 p-4">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <p className="text-center text-sm text-gray-600">
                To continue using AiDoctorNotes, please verify your email address by clicking the link in the verification email we sent you.
              </p>
              <div className="bg-amber-50 p-3 rounded-md w-full">
                <div className="flex gap-2 items-start">
                  <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">
                    If you don't see the email in your inbox, please check your spam or junk folder.
                  </p>
                </div>
              </div>
              <div className="space-y-2 w-full">
                <Button 
                  onClick={resendVerificationEmail} 
                  className="w-full"
                  disabled={isVerifying}
                  aria-busy={isVerifying}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Sending...
                    </>
                  ) : (
                    "Resend Verification Email"
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/auth")} 
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
