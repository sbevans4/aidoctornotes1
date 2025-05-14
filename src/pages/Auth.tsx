
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";
import { useReferral } from "@/hooks/useReferral";
import { PaymentForm } from "@/components/PaymentForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TranscriptionPlans } from "@/components/auth/TranscriptionPlans";
import { AINotesPlans } from "@/components/auth/AINotesPlans";
import { EnterpriseCTA } from "@/components/auth/EnterpriseCTA";
import { DocumentationExample } from "@/components/auth/DocumentationExample";
import { OnboardingTour } from "@/components/auth/OnboardingTour";

export default function Auth() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("sign-in");
  const navigate = useNavigate();
  const { plans, isLoading } = useSubscription();
  const { applyReferral } = useReferral();
  const [referralCode, setReferralCode] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-4">
          <Skeleton className="h-8 w-64"/>
          <Skeleton className="h-32 w-96"/>
        </div>
      </div>
    );
  }

  const standardPlans = plans?.filter(plan => plan.name !== "Enterprise") || [];
  const transcriptionPlans = standardPlans.filter(plan => plan.type === "transcription").slice(0, 3);
  const aiNotesPlans = standardPlans.filter(plan => plan.type === "ai_notes").slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">ConvoNotes Genius</h1>
            <p className="mt-2 text-sm text-gray-600">Medical Documentation Assistant</p>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="sign-in">Sign In</TabsTrigger>
                  <TabsTrigger value="sign-up">Sign Up</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sign-in">
                  <SignInForm />
                </TabsContent>
                
                <TabsContent value="sign-up">
                  <SignUpForm />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Dialog open={!!selectedPlanId} onOpenChange={() => setSelectedPlanId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <div className="space-y-4">
            {selectedPlanId && (
              <>
                <PaymentForm
                  planId={selectedPlanId}
                  onSuccess={() => {
                    if (referralCode) {
                      applyReferral.mutate(referralCode);
                    }
                    setSelectedPlanId(null);
                    navigate("/medical-documentation");
                  }}
                  onCancel={() => setSelectedPlanId(null)}
                />
                <div className="mt-4">
                  <Label htmlFor="referralCode">Have a referral code?</Label>
                  <Input
                    id="referralCode"
                    placeholder="Enter referral code"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
