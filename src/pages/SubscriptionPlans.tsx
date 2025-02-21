
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSubscription } from "@/hooks/useSubscription";
import { Check, CreditCard, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubscriptionPlans = () => {
  const { plans, currentSubscription, isLoading, subscribeToPlan } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Subscription Plans</h1>
            <p className="text-gray-600 mt-2">Choose the plan that best fits your needs</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/")}>
            Back to Dashboard
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans?.map((plan) => {
            const isCurrentPlan = currentSubscription?.plan_id === plan.id;
            const priceDisplay = plan.name === "Pay-As-You-Go" ? "0.50" : plan.price;
            return (
              <Card key={plan.id} className="p-6 flex flex-col">
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
                  {(plan.features as string[]).map((feature, index) => (
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
          })}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
