
import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface MobilePlanViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tierOrder: string[];
  plans: Record<string, {
    title: string;
    price: string;
    description: string;
    includesText?: string;
    popular?: boolean;
  }>;
  features: Record<string, Record<string, { 
    text: string; 
    tooltip: string; 
    tiers: Record<string, boolean>;
  }>>;
}

export const MobilePlanView: React.FC<MobilePlanViewProps> = ({ 
  activeTab, 
  setActiveTab,
  tierOrder,
  plans,
  features
}) => {
  // Flatten features for display
  const getFlattenedFeatures = (tier: string) => {
    const result: { text: string; included: boolean }[] = [];
    
    Object.values(features).forEach(category => {
      Object.values(category).forEach(feature => {
        // Only add each feature once
        if (!result.some(f => f.text === feature.text)) {
          result.push({
            text: feature.text,
            included: feature.tiers[tier] || false
          });
        }
      });
    });
    
    return result;
  };

  return (
    <div className="md:hidden mb-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="all">All Plans</TabsTrigger>
          <TabsTrigger value="compare">Compare</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {tierOrder.map((tier) => {
            const plan = plans[tier];
            const flattenedFeatures = getFlattenedFeatures(tier);
            const includedFeatures = flattenedFeatures.filter(f => f.included);
            
            return (
              <Card key={tier} className={`overflow-hidden ${plan.popular ? 'border-2 border-primary' : ''}`}>
                {plan.popular && (
                  <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-medium">
                    Most Popular
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold">{plan.title}</h3>
                    <div className="flex items-baseline mt-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground ml-1">/month</span>
                    </div>
                    {plan.includesText && (
                      <p className="text-sm text-blue-600 font-medium mt-1">{plan.includesText}</p>
                    )}
                    <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                  </div>
                  
                  <div className="space-y-2 mt-4">
                    <p className="font-medium">Key Features:</p>
                    {includedFeatures.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                        <span className="text-sm">{feature.text}</span>
                      </div>
                    ))}
                    {includedFeatures.length > 5 && (
                      <p className="text-sm text-muted-foreground">
                        +{includedFeatures.length - 5} more features
                      </p>
                    )}
                  </div>
                  
                  <Button className="w-full mt-4">Select Plan</Button>
                </CardContent>
              </Card>
            );
          })}
        </TabsContent>
        
        <TabsContent value="compare">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left">Feature</th>
                  {tierOrder.map((tier) => (
                    <th key={tier} className="py-2 px-4 text-center">
                      {plans[tier].title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(features).map(([category, categoryFeatures]) => (
                  <React.Fragment key={category}>
                    <tr className="bg-gray-50">
                      <td colSpan={tierOrder.length + 1} className="py-2 px-4 font-semibold">
                        {category}
                      </td>
                    </tr>
                    {Object.values(categoryFeatures).map((feature, idx) => (
                      <tr key={`${category}-${idx}`} className="border-b">
                        <td className="py-2 px-4">{feature.text}</td>
                        {tierOrder.map((tier) => (
                          <td key={`${tier}-${category}-${idx}`} className="py-2 px-4 text-center">
                            {feature.tiers[tier] ? (
                              <Check className="h-4 w-4 text-green-500 mx-auto" />
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
