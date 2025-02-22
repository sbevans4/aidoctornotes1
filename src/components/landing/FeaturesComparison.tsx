
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowDown, Check, X } from "lucide-react";
import { useState } from "react";

export const FeaturesComparison = () => {
  const [isOpen, setIsOpen] = useState(false);

  const plans = {
    trial: {
      name: "Trial",
      ehr: false,
      customTemplates: false,
      aiSoap: "Basic",
      transcription: "5 mins/day",
      support: "Community",
    },
    basic: {
      name: "Basic",
      ehr: true,
      customTemplates: false,
      aiSoap: "Standard",
      transcription: "60 mins/month",
      support: "Email",
    },
    professional: {
      name: "Professional",
      ehr: true,
      customTemplates: true,
      aiSoap: "Advanced",
      transcription: "Unlimited",
      support: "Priority",
    },
    unlimited: {
      name: "Unlimited",
      ehr: true,
      customTemplates: true,
      aiSoap: "Custom",
      transcription: "Unlimited",
      support: "24/7 Dedicated",
    },
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-4xl mx-auto space-y-2"
    >
      <div className="flex items-center justify-center">
        <CollapsibleTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2"
          >
            {isOpen ? "Hide" : "Compare All"} Features
            <ArrowDown
              className={`h-4 w-4 transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="space-y-4">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg bg-white">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Feature
                </th>
                {Object.values(plans).map((plan) => (
                  <th key={plan.name} scope="col" className="px-6 py-3">
                    {plan.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  EHR Integration
                </th>
                {Object.values(plans).map((plan) => (
                  <td key={`${plan.name}-ehr`} className="px-6 py-4">
                    {plan.ehr ? (
                      <Check className="text-green-500 h-5 w-5 mx-auto" />
                    ) : (
                      <X className="text-red-500 h-5 w-5 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Custom Templates
                </th>
                {Object.values(plans).map((plan) => (
                  <td key={`${plan.name}-templates`} className="px-6 py-4">
                    {plan.customTemplates ? (
                      <Check className="text-green-500 h-5 w-5 mx-auto" />
                    ) : (
                      <X className="text-red-500 h-5 w-5 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
              <tr className="bg-white border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  AI SOAP Notes
                </th>
                {Object.values(plans).map((plan) => (
                  <td key={`${plan.name}-ai`} className="px-6 py-4 text-center">
                    {plan.aiSoap}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50 border-b">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Transcription Limit
                </th>
                {Object.values(plans).map((plan) => (
                  <td key={`${plan.name}-transcription`} className="px-6 py-4 text-center">
                    {plan.transcription}
                  </td>
                ))}
              </tr>
              <tr className="bg-white">
                <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  Support Level
                </th>
                {Object.values(plans).map((plan) => (
                  <td key={`${plan.name}-support`} className="px-6 py-4 text-center">
                    {plan.support}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
