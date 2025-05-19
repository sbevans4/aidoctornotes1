
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { isNetworkError, formatAuthError } from "@/utils/formValidation";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [networkError, setNetworkError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  
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
  }, [accessToken, refreshToken, type]);
  
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">Email Verification</CardTitle>
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
              <AlertDescription>{networkError}</AlertDescription>
            </Alert>
          )}
          
          {isVerifying ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : isVerified ? (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
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
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="rounded-full bg-amber-100 p-3">
                <AlertCircle className="h-6 w-6 text-amber-600" />
              </div>
              <p className="text-center text-sm text-gray-600">
                To continue using AiDoctorNotes, please verify your email address by clicking the link in the verification email we sent you.
              </p>
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
