
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PricingCard } from "./PricingCard";
import { planHighlights, getPreviousTier } from "./pricingUtils";

interface MobilePlanSelectorProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  plans: any[];
  currentSubscriptionId?: string;
  onShowDetails: (planId: string) => void;
  onSubscribe: (planId: string) => void;
  onStartTrial: (planId: string) => void;
  referralDiscount?: number;
  getDiscountedPrice: (price: number) => string;
}

export const MobilePlanSelector = ({
  activeTab,
  onTabChange,
  plans,
  currentSubscriptionId,
  onShowDetails,
  onSubscribe,
  onStartTrial,
  referralDiscount,
  getDiscountedPrice
}: MobilePlanSelectorProps) => {
  // Function to get active plans based on tab selection
  const getActivePlans = () => {
    if (!plans) return [];
    
    if (activeTab === "all") return plans;
    if (activeTab === "popular") return plans.filter(plan => plan.tier === "professional");
    if (activeTab === "basic") return plans.filter(plan => ["basic", "standard"].includes(plan.tier));
    if (activeTab === "advanced") return plans.filter(plan => ["unlimited", "professional", "image_analysis"].includes(plan.tier));
    
    return plans;
  };

  const activePlans = getActivePlans();

  return (
    <div className="md:hidden">
      <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-6 mt-6">
        {activePlans.map((plan) => {
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
              mobileView={true}
            />
          );
        })}
      </div>
    </div>
  );
};
