
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function EmailVerification() {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get the access token and other parameters from the URL
  const accessToken = searchParams.get("access_token");
  const refreshToken = searchParams.get("refresh_token");
  const type = searchParams.get("type");
  
  useEffect(() => {
    const verifyEmail = async () => {
      setIsVerifying(true);
      
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
        toast({
          variant: "destructive",
          title: "Verification failed",
          description: error.message || "Failed to verify your email. Please try again.",
        });
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
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send verification email. Please try again.",
      });
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
          {isVerifying ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : isVerified ? (
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-full bg-green-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-gray-600">
                Your email has been verified successfully. You can now access all features of AiDoctorNotes.
              </p>
              <Button onClick={() => navigate("/medical-documentation")}>
                Continue to Dashboard
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="rounded-full bg-amber-100 p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-amber-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <p className="text-center text-sm text-gray-600">
                To continue using AiDoctorNotes, please verify your email address by clicking the link in the verification email we sent you.
              </p>
              <div className="space-y-2 w-full">
                <Button 
                  onClick={resendVerificationEmail} 
                  className="w-full"
                  disabled={isVerifying}
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
