
import { Check, Gift, Percent } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
  };
  isCurrentPlan: boolean;
  isProfessional: boolean;
  originalPrice: number;
  discountedPrice: string;
  referralDiscount?: number;
  onShowDetails: () => void;
  onSubscribe: () => void;
}

export const PricingCard = ({
  plan,
  isCurrentPlan,
  isProfessional,
  originalPrice,
  discountedPrice,
  referralDiscount,
  onShowDetails,
  onSubscribe,
}: PricingCardProps) => {
  return (
    <Card 
      className={`p-6 ${isProfessional ? "border-2 border-primary shadow-lg relative" : ""}`}
    >
      {isProfessional && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
            Most Popular
          </span>
        </div>
      )}
      <div className={`${isProfessional ? "pt-4" : ""}`}>
        <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
        <div className="flex items-baseline gap-1 mb-6">
          {referralDiscount ? (
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold">${discountedPrice}</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span className="line-through">${originalPrice}</span>
                <span className="text-green-600 font-medium">
                  ({referralDiscount}% off)
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold">${originalPrice}</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          )}
        </div>
        
        <div className="space-y-4 mb-8">
          {plan.features.slice(0, 4).map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </div>
          ))}
        </div>
        
        {plan.features.length > 4 && (
          <Button
            variant="ghost"
            className="w-full mb-4 text-primary hover:text-primary"
            onClick={onShowDetails}
          >
            View All Features
          </Button>
        )}
        
        <Button
          className={`w-full ${isProfessional ? "bg-primary hover:bg-primary/90" : ""}`}
          variant={isCurrentPlan ? "secondary" : "default"}
          disabled={isCurrentPlan}
          onClick={onSubscribe}
        >
          {isCurrentPlan ? "Current Plan" : "Get Started"}
        </Button>
      </div>
    </Card>
  );
};
