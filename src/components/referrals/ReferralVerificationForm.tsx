
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useMutation } from "@tanstack/react-query";

interface ReferralVerificationFormProps {
  onSuccess?: (referrerId: string) => void;
}

export const ReferralVerificationForm: React.FC<ReferralVerificationFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const { toast } = useToast();
  
  const verify = useMutation({
    mutationFn: async () => {
      const response = await supabase.functions.invoke('verify-referral', {
        body: { email, code }
      });
      
      if (response.error) {
        throw new Error(response.error.message || "Verification failed");
      }
      
      return response.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Verification Successful",
        description: "Your referral code has been verified!"
      });
      
      if (onSuccess && data.referrerId) {
        onSuccess(data.referrerId);
      }
    },
    onError: (error) => {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Please check the email and code and try again.",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code) {
      toast({
        title: "Missing information",
        description: "Please enter both email and referral code",
        variant: "destructive",
      });
      return;
    }
    verify.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Referral</CardTitle>
        <CardDescription>
          Enter the email address and referral code you received
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="code">Referral Code</Label>
            <Input
              id="code"
              placeholder="Enter your referral code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              required
            />
          </div>
          
          {verify.isError && (
            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5" />
              <p className="text-sm text-red-600">
                {verify.error instanceof Error ? verify.error.message : "Verification failed. Please try again."}
              </p>
            </div>
          )}
          
          <Button type="submit" className="w-full" disabled={verify.isPending}>
            {verify.isPending ? "Verifying..." : "Verify Referral"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
