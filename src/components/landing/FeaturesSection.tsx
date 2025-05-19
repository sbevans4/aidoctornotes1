
import { useState } from "react";
import { ReferralBanner } from "./pricing/ReferralBanner";
import { FeatureComparison } from "./features/FeatureComparison";
import { MobilePlanView } from "./features/MobilePlanView";
import { FeatureTestimonials } from "./features/FeatureTestimonials";
import { FeatureCta } from "./features/FeatureCta";
import { UrgencyBanner } from "./features/UrgencyBanner";
import { tierOrder, plans, features, testimonials } from "./features/featureData";
import { useReferral } from "@/hooks/useReferral";

export const FeaturesSection = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { referralData } = useReferral();
  // Extract discount from referralData correctly
  const discount = referralData?.activeDiscount;

  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Compare Plans</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Choose the plan that best fits your practice needs. All higher-tier plans include features from lower tiers.
        </p>

        {/* Referral Banner - Show if discount is available */}
        <ReferralBanner discount={discount} />

        {/* Urgency Banner - Behavioral Economics */}
        <UrgencyBanner />
        
        {/* Mobile View - Tab Navigation for Plans */}
        <MobilePlanView 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          tierOrder={tierOrder}
          plans={plans}
          features={features}
        />
        
        {/* Desktop View - Full Comparison Table */}
        <FeatureComparison 
          tierOrder={tierOrder}
          plans={plans}
          features={features}
        />

        {/* Testimonials Section - Social Proof */}
        <FeatureTestimonials testimonials={testimonials} />

        {/* Call To Action */}
        <FeatureCta />
      </div>
    </section>
  );
};
