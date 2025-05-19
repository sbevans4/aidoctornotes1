
import React, { useState } from "react";
import { Check, ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { featureData } from "./featureData";

interface FeatureComparisonProps {
  tierOrder: string[];
  plans: Record<string, {
    title: string;
    price: string;
    description: string;
    includesText?: string;
    popular?: boolean;
  }>;
  features: Record<string, Record<string, { text: string; tooltip: string; tiers: Record<string, boolean> }>>;
}

export const FeatureComparison = ({ 
  tierOrder, 
  plans, 
  features 
}: FeatureComparisonProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
          <thead>
            <tr className="border-b">
              <th className="p-4 text-left">Features</th>
              {tierOrder.map(tier => (
                <th key={tier} className="p-4 text-center relative min-w-[200px]">
                  {plans[tier].popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    </div>
                  )}
                  <div className="font-bold text-lg mt-3">{plans[tier].title}</div>
                  <div className="text-gray-600">{plans[tier].price}</div>
                  {plans[tier].includesText && (
                    <div className="mt-1 text-xs text-blue-600 font-medium">{plans[tier].includesText}</div>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className={`transition-all duration-300 ${isExpanded ? 'max-h-full' : 'max-h-[300px] overflow-hidden'}`}>
            {Object.entries(features).map(([category, featureItems]) => (
              <React.Fragment key={`category-${category}`}>
                <tr className="bg-gray-50">
                  <td colSpan={7} className="p-2 px-4 font-semibold text-gray-700">{category}</td>
                </tr>
                {Object.entries(featureItems).map(([featureKey, feature]) => (
                  <tr key={featureKey} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex items-center gap-2 cursor-help">
                              {feature.text}
                              <Info className="h-4 w-4 text-gray-400" />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{feature.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </td>
                    {tierOrder.map(tier => (
                      <td key={`${featureKey}-${tier}`} className="p-4 text-center">
                        {feature.tiers[tier] ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Expand/Collapse Controls */}
      <div className="text-center mt-4">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-sm"
        >
          {isExpanded ? (
            <>
              Collapse Features <ChevronUp className="ml-1 h-4 w-4" />
            </>
          ) : (
            <>
              Show All Features <ChevronDown className="ml-1 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
