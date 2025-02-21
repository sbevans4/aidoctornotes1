
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

export default function Auth() {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { plans, isLoading } = useSubscription();
  const { applyReferral } = useReferral();
  const [referralCode, setReferralCode] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  const standardPlans = plans?.filter(plan => plan.name !== "Enterprise") || [];
  const transcriptionPlans = standardPlans.filter(plan => plan.type === "transcription").slice(0, 3);
  const aiNotesPlans = standardPlans.filter(plan => plan.type === "ai_notes").slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Medical Documentation Assistant</h2>
          <p className="mt-2 text-gray-600">Streamline your clinical documentation with AI</p>
        </div>

        <div className="space-y-12">
          <TranscriptionPlans 
            plans={transcriptionPlans} 
            onSelectPlan={setSelectedPlanId} 
          />

          <AINotesPlans 
            plans={aiNotesPlans} 
            onSelectPlan={setSelectedPlanId} 
          />

          <EnterpriseCTA />
        </div>

        <DocumentationExample />

        <div className="text-center">
          <p className="text-sm text-gray-600">
            14-day money-back guarantee • Cancel anytime
          </p>
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

