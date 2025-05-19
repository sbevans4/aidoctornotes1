
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MobilePlanViewProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
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

export const MobilePlanView = ({ 
  activeTab, 
  setActiveTab, 
  tierOrder, 
  plans, 
  features 
}: MobilePlanViewProps) => {
  
  // Function to filter plans for mobile view
  const getActivePlans = () => {
    if (activeTab === "all") return tierOrder;
    if (activeTab === "popular") return ["professional"];
    if (activeTab === "basic") return ["basic", "standard"];
    if (activeTab === "advanced") return ["unlimited", "professional", "image_analysis"];
    return tierOrder;
  };

  return (
    <div className="md:hidden">
      {/* Mobile Tab Navigation */}
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Mobile Plan Cards */}
      {getActivePlans().map((tier) => (
        <div key={tier} className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b relative">
            {plans[tier].popular && (
              <div className="absolute top-0 right-0">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-2.5 py-0.5 rounded-bl">
                  Most Popular
                </span>
              </div>
            )}
            <h3 className="font-bold text-xl">{plans[tier].title}</h3>
            <p className="text-gray-600">{plans[tier].price}</p>
            {plans[tier].includesText && (
              <p className="mt-1 text-sm text-blue-600 font-medium">{plans[tier].includesText}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">{plans[tier].description}</p>
          </div>
          
          {/* Collapsible Feature List for Mobile */}
          <div className="p-4">
            <h4 className="font-medium mb-3">Key Features:</h4>
            <ul className="space-y-2">
              {Object.entries(features).flatMap(([category, featureItems]) => 
                Object.entries(featureItems)
                  .filter(([_, feature]) => feature.tiers[tier])
                  .slice(0, 4) // Only show top 4 features in collapsed view
                  .map(([featureKey, feature]) => (
                    <li key={featureKey} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature.text}</span>
                    </li>
                  ))
              )}
            </ul>
            <Button variant="outline" className="w-full mt-4" size="sm">
              See All Features
            </Button>
          </div>
          
          <div className="p-4 bg-gray-50">
            <Button className="w-full" variant={plans[tier].popular ? "default" : "outline"}>
              {tier === "enterprise" ? "Contact Sales" : "Choose Plan"}
            </Button>
            {tier !== "basic" && tier !== "enterprise" && (
              <p className="text-center text-sm mt-2 text-blue-600">
                or <span className="underline cursor-pointer">try free for 7 days</span>
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
