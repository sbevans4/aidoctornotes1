
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useNavigate } from "react-router-dom";
import { SubscriptionPlanCard } from "@/components/subscription/SubscriptionPlanCard";
import { SubscriptionPlansLoadingSkeleton } from "@/components/subscription/SubscriptionPlansLoadingSkeleton";

const SubscriptionPlans = () => {
  const { plans, currentSubscription, isLoading, subscribeToPlan } = useSubscription();
  const navigate = useNavigate();

  if (isLoading) {
    return <SubscriptionPlansLoadingSkeleton />;
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
          {plans?.map((plan) => (
            <SubscriptionPlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={currentSubscription?.plan_id === plan.id}
              subscribeToPlan={subscribeToPlan}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
