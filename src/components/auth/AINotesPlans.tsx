
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  type: string;
}

interface AINotesPlansProps {
  plans: Plan[];
  onSelectPlan: (planId: string) => void;
}

export function AINotesPlans({ plans, onSelectPlan }: AINotesPlansProps) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-6">AI-Assisted Notes Plans</h3>
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`p-6 flex flex-col ${plan.name === 'Pro' ? 'border-2 border-primary relative' : ''}`}
          >
            {plan.name === 'Pro' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}
            <div className="mb-4">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-6 flex-grow">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full mt-auto"
              variant={plan.name === 'Pro' ? 'default' : 'outline'}
              onClick={() => onSelectPlan(plan.id)}
            >
              {plan.name === 'Trial' ? 'Start Trial' : 'Get Started'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

