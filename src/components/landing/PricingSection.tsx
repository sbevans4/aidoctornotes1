
import { useState } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { useReferral } from "@/hooks/useReferral";
import { supabase } from "@/integrations/supabase/client";

// Import our new components
import { KeyFeatures } from "./pricing/KeyFeatures";
import { SocialProofSection } from "./pricing/SocialProofSection";
import { TrialBanner } from "./pricing/TrialBanner";
import { UrgencyBanner } from "./pricing/UrgencyBanner";
import { ReferralBanner } from "./pricing/ReferralBanner";
import { TestimonialsSection } from "./pricing/TestimonialsSection";
import { EnterpriseSection } from "./pricing/EnterpriseSection";
import { PlanDetailsDialog } from "./pricing/PlanDetailsDialog";
import { PaymentDialog } from "./pricing/PaymentDialog";
import { MobilePlanSelector } from "./pricing/MobilePlanSelector";
import { DesktopPlanDisplay } from "./pricing/DesktopPlanDisplay";
import { socialProofNumbers } from "./pricing/pricingUtils";
import { Scroll, Mic, Brain } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState("all");

  const handleSubscribe = async (planId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      handleLogin();
      return;
    }
    setSelectedPlanId(planId);
  };

  // Function to handle starting a free trial
  const handleStartTrial = async (planId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      handleLogin();
      return;
    }
    // In a real implementation, this would call an endpoint to start the trial
    // For now, just show a toast message
    alert("Trial functionality would be implemented in a real app");
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

  // Get the currently displayed plan details for the dialog
  const currentPlanDetails = plans?.find(p => p.id === showDetailsForPlan);

  return (
    <section className="py-16 bg-gray-50" id="pricing">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-6">Choose Your Plan</h2>
        <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          Select the plan that best fits your practice needs. Higher tier plans include all features from lower tiers, plus additional capabilities.
        </p>
        
        {/* Social Proof Numbers */}
        <SocialProofSection 
          doctors={socialProofNumbers.doctors}
          notes={socialProofNumbers.notes}
          saved={socialProofNumbers.saved}
          satisfaction={socialProofNumbers.satisfaction}
        />
        
        {/* Trial Banner - Behavioral Economics */}
        {showTrialBanner && (
          <TrialBanner 
            onStartTrial={() => handleStartTrial('professional')}
            onDismiss={() => setShowTrialBanner(false)}
          />
        )}
        
        {/* Urgency Banner - Behavioral Economics */}
        {showUrgencyBanner && (
          <UrgencyBanner 
            onDismiss={() => setShowUrgencyBanner(false)}
          />
        )}

        {/* Referral Discount Banner */}
        <ReferralBanner discount={referralData?.activeDiscount} />

        {/* Mobile View - Tab Navigation for Plans */}
        <MobilePlanSelector
          activeTab={activeTab}
          onTabChange={setActiveTab}
          plans={displayPlans || []}
          currentSubscriptionId={currentSubscription?.plan_id}
          onShowDetails={setShowDetailsForPlan}
          onSubscribe={handleSubscribe}
          onStartTrial={handleStartTrial}
          referralDiscount={referralData?.activeDiscount}
          getDiscountedPrice={getDiscountedPrice}
        />

        <KeyFeatures features={keyFeatures} />
        
        {/* Desktop View */}
        <DesktopPlanDisplay
          plans={displayPlans || []}
          currentSubscriptionId={currentSubscription?.plan_id}
          onShowDetails={setShowDetailsForPlan}
          onSubscribe={handleSubscribe}
          onStartTrial={handleStartTrial}
          referralDiscount={referralData?.activeDiscount}
          getDiscountedPrice={getDiscountedPrice}
        />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Enterprise Section */}
        <EnterpriseSection />
      </div>

      {/* Payment Dialog */}
      <PaymentDialog
        open={!!selectedPlanId}
        onOpenChange={() => setSelectedPlanId(null)}
        planId={selectedPlanId}
        onSuccess={() => setSelectedPlanId(null)}
      />

      {/* Plan Details Dialog */}
      <PlanDetailsDialog
        open={!!showDetailsForPlan}
        onOpenChange={() => setShowDetailsForPlan(null)}
        plan={currentPlanDetails}
      />
    </section>
  );
};
