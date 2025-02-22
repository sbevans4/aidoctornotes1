
import { Button } from "@/components/ui/button";
import { Check, Info } from "lucide-react";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { useState } from "react";

type Feature = {
  text: string;
  tooltip: string;
};

type PlanType = {
  title: string;
  price?: string;
  popular?: boolean;
  features: Feature[];
};

export const FeaturesSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const features: Record<string, PlanType> = {
    basic: {
      title: "Basic Plan",
      price: "$19.99/month",
      features: [
        { text: "100 minutes/month transcription", tooltip: "Audio to text conversion with high accuracy" },
        { text: "Basic summary + highlights", tooltip: "AI-generated summaries of your recordings" },
        { text: "Up to 10 SOAP notes/month", tooltip: "Structured clinical documentation" },
      ],
    },
    professional: {
      title: "Professional Plan",
      price: "$259.99/month",
      popular: true,
      features: [
        { text: "500 minutes/month transcription", tooltip: "More than double the transcription time" },
        { text: "Direct EHR integration", tooltip: "Seamlessly export notes to your EHR system" },
        { text: "Priority support", tooltip: "Get help faster when you need it" },
        { text: "Custom SOAP templates", tooltip: "Create and save your preferred note formats" },
      ],
    },
    enterprise: {
      title: "Enterprise Plan",
      price: "Contact Sales",
      features: [
        { text: "Unlimited team transcription", tooltip: "No limits on users or minutes" },
        { text: "Custom code libraries", tooltip: "Add your frequently used codes" },
        { text: "Dedicated account manager", tooltip: "Personal support for your organization" },
        { text: "Advanced analytics", tooltip: "Track usage and efficiency metrics" },
      ],
    },
  };

  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Compare Plans</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="border-b">
                <th className="p-4 text-left">Features</th>
                {Object.entries(features).map(([key, plan]) => (
                  <th key={key} className="p-4 text-center relative min-w-[200px]">
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                        <span className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="font-bold text-lg mt-3">{plan.title}</div>
                    {plan.price && <div className="text-gray-600">{plan.price}</div>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`transition-all duration-300 ${isExpanded ? 'max-h-full' : 'max-h-[300px] overflow-hidden'}`}>
              {features.professional.features.map((_, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-2 cursor-help">
                            {features.professional.features[index]?.text || ""}
                            <Info className="h-4 w-4 text-gray-400" />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{features.professional.features[index]?.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  {Object.entries(features).map(([planKey, plan]) => (
                    <td key={planKey} className="p-4 text-center">
                      {plan.features[index] ? (
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isExpanded && (
          <div className="text-center mt-4">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="text-sm"
            >
              Show All Features
            </Button>
          </div>
        )}

        <div className="mt-8 text-center">
          <Button 
            size="lg"
            className="bg-primary hover:bg-primary/90"
            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
          >
            View Pricing Details
          </Button>
        </div>
      </div>
    </section>
  );
};
