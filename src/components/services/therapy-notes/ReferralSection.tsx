
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useReferral } from "@/hooks/useReferral";

export const ReferralSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { referralData, sendReferralInvite } = useReferral();

  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    try {
      setIsSending(true);
      await sendReferralInvite.mutateAsync(email);
      
      toast({
        title: "Referral Sent!",
        description: `Invitation sent to ${email}. You'll receive $10 off when they sign up!`,
      });
      
      setEmail("");
    } catch (error) {
      toast({
        title: "Error sending referral",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Get $10 Off by Referring a Colleague</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Sign up to refer your colleagues and earn $10 off your subscription for each new sign-up!
          </p>
          <Button onClick={() => window.location.href = "/auth"}>
            Sign Up To Start Referring
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Refer a Colleague, Get $10 Off!</h2>
          <p className="text-lg mb-8">
            Invite your colleagues to ConvoNotes Genius and receive $10 off your next month's 
            subscription for each person who signs up. They'll get a special discount too!
          </p>
          
          {referralData?.activeDiscount ? (
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-8">
              <p className="font-semibold text-green-800">
                You currently have a {referralData.activeDiscount}% discount applied to your subscription!
              </p>
              {referralData.expiryDate && (
                <p className="text-green-700">
                  Valid until: {new Date(referralData.expiryDate).toLocaleDateString()}
                </p>
              )}
            </div>
          ) : null}
          
          <form onSubmit={handleSendInvite} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="Colleague's email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>
            <Button type="submit" disabled={isSending}>
              {isSending ? "Sending..." : "Send Referral"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
