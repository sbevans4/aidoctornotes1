
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useReferral } from "@/hooks/useReferral";
import { Share, Copy, Check, Users, Gift } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export const ReferralSection: React.FC = () => {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
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

  const handleCopyReferralLink = async () => {
    // This is a placeholder since we don't have actual referral links yet
    const referralLink = `https://aidoctornotes.com/signup?ref=${referralData?.code || 'join'}`;
    
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Referral link copied to clipboard",
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy manually",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Gift className="h-12 w-12 text-blue-500 mr-3" />
            <h2 className="text-3xl font-bold">Get $10 Off by Referring a Colleague</h2>
          </div>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Sign up to refer your colleagues and earn $10 off your subscription for each new sign-up!
            They'll receive a special discount too.
          </p>
          <Button onClick={() => window.location.href = "/auth"} size="lg" className="animate-pulse">
            Sign Up To Start Referring
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center mb-6">
              <Users className="h-12 w-12 text-blue-500 mr-3" />
              <h2 className="text-3xl font-bold">Refer a Colleague, Get $10 Off!</h2>
            </div>
            <p className="text-lg mb-2">
              Invite your colleagues to ConvoNotes Genius and receive $10 off your next month's 
              subscription for each person who signs up. They'll get a special discount too!
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Referral Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Status</CardTitle>
                <CardDescription>Track your referrals and discounts</CardDescription>
              </CardHeader>
              <CardContent>
                {referralData?.activeDiscount ? (
                  <div className="bg-green-100 border border-green-200 rounded-lg p-4 mb-4">
                    <p className="font-semibold text-green-800">
                      You currently have a {referralData.activeDiscount}% discount applied!
                    </p>
                    {referralData.expiryDate && (
                      <p className="text-green-700">
                        Valid until: {new Date(referralData.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-center p-4 bg-gray-50 rounded-md">
                    You don't have any active discounts yet. Start referring to earn discounts!
                  </p>
                )}

                <div className="mt-4 flex justify-center">
                  <Button variant="outline" className="flex items-center" onClick={handleCopyReferralLink}>
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied!" : "Copy Referral Link"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Send Invitation Card */}
            <Card>
              <CardHeader>
                <CardTitle>Send an Invitation</CardTitle>
                <CardDescription>Invite colleagues via email</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSendInvite} className="space-y-4">
                  <div className="flex flex-col">
                    <Input
                      type="email"
                      placeholder="Colleague's email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSending}
                    className="w-full"
                  >
                    <Share className="h-4 w-4 mr-2" />
                    {isSending ? "Sending..." : "Send Referral"}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                <p>Your colleague will receive an email with your invitation and a special signup link.</p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

