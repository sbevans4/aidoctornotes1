
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, CreditCard, DollarSign } from "lucide-react";
import { UseMutationResult } from "@tanstack/react-query";

interface SubscriptionPlanCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
    tier: string;
  };
  isCurrentPlan: boolean;
  subscribeToPlan: UseMutationResult<void, Error, string>;
}

export const SubscriptionPlanCard = ({ plan, isCurrentPlan, subscribeToPlan }: SubscriptionPlanCardProps) => {
  const priceDisplay = plan.name === "Pay-As-You-Go" ? "0.50" : plan.price;

  return (
    <Card className="p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        {plan.tier === "enterprise" ? (
          <CreditCard className="h-5 w-5 text-purple-500" />
        ) : (
          <DollarSign className="h-5 w-5 text-green-500" />
        )}
        <h3 className="text-xl font-semibold">{plan.name}</h3>
      </div>
      
      <div className="mb-6">
        <p className="text-3xl font-bold">
          ${priceDisplay}
          <span className="text-sm font-normal text-gray-600">
            {plan.name === "Pay-As-You-Go" ? "/minute" : "/month"}
          </span>
        </p>
      </div>

      <ul className="space-y-3 mb-8 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2">
            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        className="w-full mt-auto"
        variant={isCurrentPlan ? "secondary" : "default"}
        disabled={isCurrentPlan}
        onClick={() => subscribeToPlan.mutate(plan.id)}
      >
        {isCurrentPlan ? "Current Plan" : "Subscribe"}
      </Button>
    </Card>
  );
};
