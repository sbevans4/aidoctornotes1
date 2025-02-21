
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Building2, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

export default function Enterprise() {
  const navigate = useNavigate();
  const { plans, isLoading } = useSubscription();
  const enterprisePlan = plans?.find(plan => plan.name === "Enterprise");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="h-32 bg-gray-200 rounded w-96"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-8 flex items-center gap-2"
          onClick={() => navigate("/auth")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Plans
        </Button>

        <div className="text-center mb-12">
          <Building2 className="h-12 w-12 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">Enterprise Solutions</h1>
          <p className="text-xl text-gray-600">
            Customized medical documentation solutions for larger organizations
          </p>
        </div>

        {enterprisePlan && (
          <Card className="p-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Enterprise Features</h2>
                <ul className="space-y-4">
                  {(enterprisePlan.features as string[]).map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
                <p className="text-gray-600 mb-6">
                  Contact us to discuss your organization's specific needs and get a customized quote.
                </p>
                <Button className="w-full" size="lg">
                  Contact Sales
                </Button>
                <p className="mt-4 text-sm text-gray-500 text-center">
                  We'll respond within 24 hours
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
