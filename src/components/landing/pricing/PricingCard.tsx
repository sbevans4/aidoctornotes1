
import { Check, Gift, Percent, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface PricingCardProps {
  plan: {
    id: string;
    name: string;
    price: number;
    features: string[];
    tier?: string;
  };
  isCurrentPlan: boolean;
  isProfessional: boolean;
  originalPrice: number;
  discountedPrice: string;
  referralDiscount?: number;
  onShowDetails: () => void;
  onSubscribe: () => void;
  onStartTrial?: () => void;
  includesText?: string;
  highlights?: string[];
  showTrial?: boolean;
  mobileView?: boolean;
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
  onStartTrial,
  includesText,
  highlights,
  showTrial = false,
  mobileView = false,
}: PricingCardProps) => {
  // Determine the most appropriate features to show
  const displayFeatures = highlights || plan.features.slice(0, 4).map(feature => {
    // Replace plan references with correct hierarchy
    if (feature === "Everything in Professional") {
      return "Everything in Professional";
    } else if (feature === "Everything in Standard") {
      return "Everything in Standard";
    } else if (feature === "Everything in Unlimited") {
      return "Everything in Unlimited";
    }
    return feature;
  });

  return (
    <Card 
      className={`p-6 ${isProfessional ? "border-2 border-primary shadow-lg relative" : ""} 
                 ${mobileView ? "w-full" : ""}`}
    >
      {isProfessional && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <span className="bg-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3" />
            <span>Most Popular</span>
          </span>
        </div>
      )}
      <div className={`${isProfessional ? "pt-4" : ""}`}>
        <h3 className="text-xl font-semibold mb-0.5">{plan.name}</h3>
        {includesText && (
          <p className="text-xs text-blue-600 font-medium mb-2">{includesText}</p>
        )}
        <div className="flex items-baseline gap-1 mb-4">
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
        
        <div className="space-y-3 mb-6">
          {displayFeatures.map((feature, index) => (
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
          className={`w-full mb-2 ${isProfessional ? "bg-primary hover:bg-primary/90" : ""}`}
          variant={isCurrentPlan ? "secondary" : "default"}
          disabled={isCurrentPlan}
          onClick={onSubscribe}
        >
          {isCurrentPlan ? "Current Plan" : "Get Started"}
        </Button>
        
        {showTrial && onStartTrial && !isCurrentPlan && (
          <Button 
            variant="ghost" 
            className="w-full text-sm"
            onClick={onStartTrial}
          >
            <Gift className="h-3.5 w-3.5 mr-1.5" />
            Try free for 7 days
          </Button>
        )}
      </div>
    </Card>
  );
};
