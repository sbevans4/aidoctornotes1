
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { PaymentForm } from "@/components/PaymentForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";

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

  const getFormattedPrice = (plan: any) => {
    if (plan.type === 'transcription') {
      return "0.50";
    }
    return plan.price;
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Flexible Plans for Every Practice</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans?.slice(0, 3).map((plan) => {
            const isCurrentPlan = currentSubscription?.plan_id === plan.id;
            const priceDisplay = getFormattedPrice(plan);
            return (
              <Card key={plan.id} className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">
                  ${priceDisplay}
                  <span className="text-sm font-normal text-gray-600">
                    {plan.type === 'transcription' ? "/minute" : "/month"}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {(plan.features as string[]).slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
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
                  {isCurrentPlan ? "Current Plan" : "Subscribe"}
                </Button>
              </Card>
            );
          })}
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
