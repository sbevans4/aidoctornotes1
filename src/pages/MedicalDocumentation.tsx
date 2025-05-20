
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import VoiceRecorder from "@/components/VoiceRecorder";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react"; // Changed from ExclamationTriangleIcon
import { useNavigate } from "react-router-dom";

export default function MedicalDocumentation() {
  const { subscriptionStatus, checkHasFeature } = useAuth();
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (subscriptionStatus.expiresAt) {
      const now = new Date();
      const expiresAt = new Date(subscriptionStatus.expiresAt);
      const differenceInTime = expiresAt.getTime() - now.getTime();
      const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));
      
      setDaysRemaining(differenceInDays);
    }
  }, [subscriptionStatus.expiresAt]);

  return (
    <>
      <Helmet>
        <title>Medical Documentation | AIDoctorNotes</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Medical Documentation</h1>
        
        {/* Subscription Status Alert */}
        {!subscriptionStatus.isSubscribed && (
          <Alert variant="default" className="mb-6 bg-amber-50 border-amber-200"> {/* Changed from "warning" to "default" */}
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" /> {/* Changed from ExclamationTriangleIcon */}
            <AlertDescription>
              You are currently using the free trial version. 
              <Button 
                variant="link" 
                className="px-1 py-0 h-auto"
                onClick={() => navigate("/subscription-plans")}
              >
                Upgrade now
              </Button>
              to unlock all features.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Trial Expiration Alert */}
        {subscriptionStatus.isSubscribed && daysRemaining !== null && daysRemaining <= 7 && (
          <Alert variant="default" className="mb-6 bg-amber-50 border-amber-200"> {/* Changed from "warning" to "default" */}
            <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" /> {/* Changed from ExclamationTriangleIcon */}
            <AlertDescription>
              Your subscription will expire in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}. 
              <Button 
                variant="link" 
                className="px-1 py-0 h-auto"
                onClick={() => navigate("/subscription-plans")}
              >
                Renew now
              </Button>
              to avoid interruption.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Voice Recorder Component */}
        <VoiceRecorder />
      </div>
    </>
  );
}
