
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Scroll, Mic, Brain } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { PaymentForm } from "@/components/PaymentForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { FeaturesComparison } from "./FeaturesComparison";

interface PricingSectionProps {
  handleLogin: () => Promise<void>;
}

export const PricingSection = ({ handleLogin }: PricingSectionProps) => {
  const { plans, currentSubscription } = useSubscription();
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

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
      title: "5 Custom Code Tabs",
      description: "Organize and access your frequently used codes efficiently",
    },
    {
      icon: Mic,
      title: "Real-Time Transcription",
      description: "Convert speech to text instantly with high accuracy",
    },
    {
      icon: Brain,
      title: "DeepSeek AI SOAP Notes",
      description: "Generate structured clinical notes automatically",
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          {keyFeatures.map((feature) => (
            <Card key={feature.title} className="p-6 text-center">
              <feature.icon className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>

        <FeaturesComparison />

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans?.filter(plan => plan.name !== "Enterprise").map((plan) => {
            const isCurrentPlan = currentSubscription?.plan_id === plan.id;
            return (
              <Card key={plan.id} className={`p-6 ${plan.name === "Professional" ? "border-2 border-primary" : ""}`}>
                {plan.name === "Professional" && (
                  <div className="text-sm font-medium text-center text-primary mb-4">Most Popular</div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-600">/month</span>
                </div>
                <ul className="space-y-3 mb-6 min-h-[320px]">
                  {(plan.features as string[]).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "secondary" : "default"}
                  disabled={isCurrentPlan}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isCurrentPlan ? "Current Plan" : "Get Started"}
                </Button>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <h3 className="text-2xl font-bold mb-4">Need Enterprise Features?</h3>
          <p className="text-gray-600 mb-6">Get in touch for custom pricing and features tailored to your organization.</p>
          <Button variant="outline" size="lg" onClick={() => window.location.href = "/enterprise"}>
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
    </section>
  );
};
