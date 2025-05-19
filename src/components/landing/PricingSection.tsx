
import { useState } from "react";
import { Scroll, Mic, Brain, Gift, Percent, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";
import { useSubscription } from "@/hooks/useSubscription";
import { useReferral } from "@/hooks/useReferral";
import { FeaturesComparison } from "./FeaturesComparison";
import { KeyFeatures } from "./pricing/KeyFeatures";
import { PricingCard } from "./pricing/PricingCard";
import { supabase } from "@/integrations/supabase/client";

interface PricingSectionProps {
  handleLogin: () => Promise<void>;
}

export const PricingSection = ({ handleLogin }: PricingSectionProps) => {
  const { plans, currentSubscription } = useSubscription();
  const { referralData } = useReferral();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showDetailsForPlan, setShowDetailsForPlan] = useState<string | null>(null);
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [showUrgencyBanner, setShowUrgencyBanner] = useState(true);

  const handleSubscribe = async (planId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      handleLogin();
      return;
    }
    setSelectedPlanId(planId);
  };

  const keyFeatures = [
    {
      icon: Scroll,
      title: "Medical Transcription",
      description: "High-accuracy medical transcription with AI assistance",
    },
    {
      icon: Mic,
      title: "SOAP Notes",
      description: "Automated clinical documentation with structured format",
    },
    {
      icon: Brain,
      title: "Image Analysis",
      description: "Analyze medical images for diagnostic assistance",
    },
  ];

  const getDiscountedPrice = (price: number) => {
    if (referralData?.activeDiscount) {
      const discountMultiplier = (100 - referralData.activeDiscount) / 100;
      return (price * discountMultiplier).toFixed(2);
    }
    return price.toString();
  };

  // Filter and rearrange plans for proper display
  const displayPlans = plans?.filter(plan => 
    plan.name !== "Enterprise" && 
    plan.tier !== "trial"
  ).sort((a, b) => {
    // Custom ordering: Basic, Standard, Unlimited, Professional, Image Analysis
    const tierOrder = {
      'basic': 1,
      'standard': 2,
      'unlimited': 3,
      'professional': 4,
      'image_analysis': 5
    };
    return tierOrder[a.tier] - tierOrder[b.tier];
  });

  return (
    <section className="py-16 bg-gray-50" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Select the plan that best fits your practice needs. All plans include our core features
          with additional capabilities as you move up tiers.
        </p>
        
        {/* Trial Banner */}
        {showTrialBanner && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 flex items-center justify-between gap-2 text-blue-700">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                <span className="font-semibold">
                  Try Professional free for 7 days! No credit card required.
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-300 hover:bg-blue-200 text-blue-700"
                onClick={() => setShowTrialBanner(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}
        
        {/* Urgency Banner */}
        {showUrgencyBanner && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-amber-100 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-2 text-amber-700">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5" />
                <span className="font-semibold">
                  Limited time offer: 20% off Professional plan for the first 3 months!
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber-300 hover:bg-amber-200 text-amber-700"
                onClick={() => setShowUrgencyBanner(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Referral Discount Banner */}
        {referralData?.activeDiscount && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-green-100 border border-green-200 rounded-lg p-4 flex items-center justify-center gap-2 text-green-700">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">
                You have a {referralData.activeDiscount}% discount available!
              </span>
              <Percent className="w-4 h-4" />
            </div>
          </div>
        )}

        <KeyFeatures features={keyFeatures} />
        
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {displayPlans?.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan_id === plan.id;
            const isProfessional = plan.name === "Professional";
            const originalPrice = plan.price;
            const discountedPrice = getDiscountedPrice(originalPrice);
            
            return (
              <PricingCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={isCurrentPlan}
                isProfessional={isProfessional}
                originalPrice={originalPrice}
                discountedPrice={discountedPrice}
                referralDiscount={referralData?.activeDiscount}
                onShowDetails={() => setShowDetailsForPlan(plan.id)}
                onSubscribe={() => handleSubscribe(plan.id)}
              />
            );
          })}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold mb-4">Need Enterprise Features?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Looking for custom features, dedicated support, or special requirements? Our enterprise plan is tailored to your organization's needs.
          </p>
          <Button 
            variant="outline" 
            size="lg" 
            onClick={() => window.location.href = "/enterprise"}
          >
            Contact Sales
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedPlanId} onOpenChange={() => setSelectedPlanId(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedPlanId && (
            <PaymentForm
              planId={selectedPlanId}
              onSuccess={() => setSelectedPlanId(null)}
              onCancel={() => setSelectedPlanId(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!showDetailsForPlan} onOpenChange={() => setShowDetailsForPlan(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {plans?.find(p => p.id === showDetailsForPlan)?.name} Plan Features
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ul className="space-y-3">
              {plans?.find(p => p.id === showDetailsForPlan)?.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
};
