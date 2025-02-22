
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ArrowDown, Check, X, HelpCircle } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const FeaturesComparison = () => {
  const [isOpen, setIsOpen] = useState(false);

  const plans = {
    trial: {
      name: "Trial",
      ehr: {
        value: false,
        tooltip: "Electronic Health Records integration not available in trial",
      },
      customTemplates: {
        value: false,
        tooltip: "Custom templates not available in trial version",
      },
      aiSoap: {
        value: "Basic",
        tooltip: "Basic AI assistance for SOAP notes with limited features",
      },
      transcription: {
        value: "5 mins/day",
        tooltip: "Limited to 5 minutes of transcription per day",
      },
      support: {
        value: "Community",
        tooltip: "Access to community forums and basic documentation",
      },
    },
    basic: {
      name: "Basic",
      ehr: {
        value: true,
        tooltip: "Full EHR integration with major providers",
      },
      customTemplates: {
        value: false,
        tooltip: "Custom templates not included in basic plan",
      },
      aiSoap: {
        value: "Standard",
        tooltip: "Standard AI assistance with improved accuracy",
      },
      transcription: {
        value: "60 mins/month",
        tooltip: "Up to 60 minutes of transcription per month",
      },
      support: {
        value: "Email",
        tooltip: "Email support with 24-48 hour response time",
      },
    },
    professional: {
      name: "Professional",
      ehr: {
        value: true,
        tooltip: "Advanced EHR integration with all major providers",
      },
      customTemplates: {
        value: true,
        tooltip: "Create and save unlimited custom templates",
      },
      aiSoap: {
        value: "Advanced",
        tooltip: "Advanced AI features with specialized medical terminology",
      },
      transcription: {
        value: "Unlimited",
        tooltip: "Unlimited transcription minutes",
      },
      support: {
        value: "Priority",
        tooltip: "Priority support with 4-hour response time",
      },
    },
    unlimited: {
      name: "Unlimited",
      ehr: {
        value: true,
        tooltip: "Premium EHR integration with custom configurations",
      },
      customTemplates: {
        value: true,
        tooltip: "Unlimited custom templates with sharing capabilities",
      },
      aiSoap: {
        value: "Custom",
        tooltip: "Fully customizable AI SOAP notes with specialty-specific features",
      },
      transcription: {
        value: "Unlimited",
        tooltip: "Unlimited transcription with priority processing",
      },
      support: {
        value: "24/7 Dedicated",
        tooltip: "24/7 dedicated support team with instant response",
      },
    },
  };

  return (
    <TooltipProvider>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full max-w-4xl mx-auto space-y-2"
      >
        <div className="flex items-center justify-center">
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
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
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-2">
                    EHR Integration
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Connect and sync with Electronic Health Record systems</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                  {Object.values(plans).map((plan) => (
                    <td key={`${plan.name}-ehr`} className="px-6 py-4">
                      {plan.ehr.value ? (
                        <Check className="text-green-500 h-5 w-5 mx-auto" />
                      ) : (
                        <X className="text-red-500 h-5 w-5 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-2">
                    Custom Templates
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create and save custom note templates</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                  {Object.values(plans).map((plan) => (
                    <td key={`${plan.name}-templates`} className="px-6 py-4">
                      {plan.customTemplates.value ? (
                        <Check className="text-green-500 h-5 w-5 mx-auto" />
                      ) : (
                        <X className="text-red-500 h-5 w-5 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
                <tr className="bg-white border-b">
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-2">
                    AI SOAP Notes
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>AI-powered SOAP note generation capabilities</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                  {Object.values(plans).map((plan) => (
                    <td key={`${plan.name}-ai`} className="px-6 py-4 text-center">
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          <span className="border-b border-dotted border-gray-400">
                            {plan.aiSoap.value}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{plan.aiSoap.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  ))}
                </tr>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-2">
                    Transcription Limit
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Maximum voice transcription time allowed</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                  {Object.values(plans).map((plan) => (
                    <td key={`${plan.name}-transcription`} className="px-6 py-4 text-center">
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          <span className="border-b border-dotted border-gray-400">
                            {plan.transcription.value}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{plan.transcription.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  ))}
                </tr>
                <tr className="bg-white">
                  <th className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center gap-2">
                    Support Level
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Available customer support options</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                  {Object.values(plans).map((plan) => (
                    <td key={`${plan.name}-support`} className="px-6 py-4 text-center">
                      <Tooltip>
                        <TooltipTrigger className="cursor-help">
                          <span className="border-b border-dotted border-gray-400">
                            {plan.support.value}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{plan.support.tooltip}</p>
                        </TooltipContent>
                      </Tooltip>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </TooltipProvider>
  );
};

