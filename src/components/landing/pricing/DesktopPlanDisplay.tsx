
import React from "react";
import { PricingCard } from "./PricingCard";
import { planHighlights, getPreviousTier } from "./pricingUtils";

interface DesktopPlanDisplayProps {
  plans: any[];
  currentSubscriptionId?: string;
  onShowDetails: (planId: string) => void;
  onSubscribe: (planId: string) => void;
  onStartTrial: (planId: string) => void;
  referralDiscount?: number;
  getDiscountedPrice: (price: number) => string;
}

export const DesktopPlanDisplay = ({
  plans,
  currentSubscriptionId,
  onShowDetails,
  onSubscribe,
  onStartTrial,
  referralDiscount,
  getDiscountedPrice
}: DesktopPlanDisplayProps) => {
  if (!plans?.length) return null;
  
  return (
    <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
      {plans.map((plan) => {
        const isCurrentPlan = currentSubscriptionId === plan.id;
        const isProfessional = plan.tier === "professional";
        const originalPrice = plan.price;
        const discountedPrice = getDiscountedPrice(originalPrice);
        const highlights = planHighlights[plan.tier as keyof typeof planHighlights];
        
        return (
          <PricingCard
            key={plan.id}
            plan={plan}
            isCurrentPlan={isCurrentPlan}
            isProfessional={isProfessional}
            originalPrice={originalPrice}
            discountedPrice={discountedPrice}
            referralDiscount={referralDiscount}
            onShowDetails={() => onShowDetails(plan.id)}
            onSubscribe={() => onSubscribe(plan.id)}
            onStartTrial={() => onStartTrial(plan.id)}
            includesText={highlights?.title !== "Basic" ? `Everything in ${getPreviousTier(plan.tier)} +` : undefined}
            highlights={highlights?.includedFeatures}
            showTrial={plan.tier !== "basic" && plan.tier !== "enterprise"}
          />
        );
      })}
    </div>
  );
};
