import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

interface PricingSectionProps {
  handleLogin: () => Promise<void>;
}

export const PricingSection = ({ handleLogin }: PricingSectionProps) => {
  const { plans } = useSubscription();

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Flexible Plans for Every Practice</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans?.slice(0, 3).map((plan) => (
            <Card key={plan.id} className="p-6">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold mb-4">
                ${plan.price}
                <span className="text-sm font-normal text-gray-600">
                  {plan.name === "Pay-As-You-Go" ? "/minute" : "/month"}
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
                variant="outline"
                onClick={handleLogin}
              >
                Get Started
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};