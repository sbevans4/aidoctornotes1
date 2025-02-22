
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Scroll, Mic, Brain, Gift, Percent } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useReferral } from "@/hooks/useReferral";
import { PaymentForm } from "@/components/PaymentForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { FeaturesComparison } from "./FeaturesComparison";

interface PricingSectionProps {
  handleLogin: () => Promise<void>;
}

export const PricingSection = ({ handleLogin }: PricingSectionProps) => {
  const { plans, currentSubscription } = useSubscription();
  const { referralData } = useReferral();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showDetailsForPlan, setShowDetailsForPlan] = useState<string | null>(null);

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
      title: "Code Libraries",
      description: "Store and manage your frequently used medical codes",
    },
    {
      icon: Mic,
      title: "Voice Transcription",
      description: "High-accuracy medical transcription with AI assistance",
    },
    {
      icon: Brain,
      title: "AI SOAP Notes",
      description: "Automated clinical documentation with structured format",
    },
  ];

  // Calculate discounted prices if there's an active discount
  const getDiscountedPrice = (price: number) => {
    if (referralData?.activeDiscount) {
      const discountMultiplier = (100 - referralData.activeDiscount) / 100;
      return (price * discountMultiplier).toFixed(2);
    }
    return price;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        
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

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {keyFeatures.map((feature) => (
            <Card key={feature.title} className="p-6 text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        <FeaturesComparison />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.filter(plan => plan.name !== "Enterprise").map((plan) => {
            const isCurrentPlan = currentSubscription?.plan_id === plan.id;
            const isProfessional = plan.name === "Professional";
            const originalPrice = plan.price;
            const discountedPrice = getDiscountedPrice(originalPrice);
            
            return (
              <Card 
                key={plan.id} 
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
                    {referralData?.activeDiscount ? (
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold">${discountedPrice}</span>
                          <span className="text-muted-foreground">/month</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span className="line-through">${originalPrice}</span>
                          <span className="text-green-600 font-medium">
                            ({referralData.activeDiscount}% off)
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
                    {(plan.features as string[]).slice(0, 4).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  {(plan.features as string[]).length > 4 && (
                    <Button
                      variant="ghost"
                      className="w-full mb-4 text-primary hover:text-primary"
                      onClick={() => setShowDetailsForPlan(plan.id)}
                    >
                      View All Features
                    </Button>
                  )}
                  
                  <Button
                    className={`w-full ${isProfessional ? "bg-primary hover:bg-primary/90" : ""}`}
                    variant={isCurrentPlan ? "secondary" : "default"}
                    disabled={isCurrentPlan}
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {isCurrentPlan ? "Current Plan" : "Get Started"}
                  </Button>
                </div>
              </Card>
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

