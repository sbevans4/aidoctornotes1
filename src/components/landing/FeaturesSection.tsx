
import { useState } from "react";
import { Scroll, Mic, Brain, Gift, Percent, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";
import { useSubscription } from "@/hooks/useSubscription";
import { useReferral } from "@/hooks/useReferral";
import { FeaturesComparison } from "./FeaturesComparison";
import { KeyFeatures } from "./pricing/KeyFeatures";
import { PricingCard } from "./pricing/PricingCard";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

interface PricingSectionProps {
  handleLogin: () => Promise<void>;
}

export const FeaturesSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const tierOrder = ['basic', 'standard', 'unlimited', 'professional', 'image_analysis', 'enterprise'];

  // Updated feature structure to avoid type mismatches
  const features: Record<string, Record<string, { text: string; tooltip: string; tiers: Record<string, boolean> }>> = {
    "Transcription": {
      "limited_transcription": { 
        text: "Limited transcription", 
        tooltip: "60 minutes per month", 
        tiers: {
          basic: true,
          standard: false,
          unlimited: false,
          professional: false,
          image_analysis: false,
          enterprise: false
        }
      },
      "unlimited_transcription": { 
        text: "Unlimited transcription", 
        tooltip: "No monthly limits on transcription", 
        tiers: {
          basic: false,
          standard: true,
          unlimited: true,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      }
    },
    "SOAP Notes": {
      "limited_soap": { 
        text: "5 SOAP notes/month", 
        tooltip: "Limited to 5 AI-generated clinical notes per month", 
        tiers: {
          basic: true,
          standard: false,
          unlimited: false,
          professional: false,
          image_analysis: false,
          enterprise: false
        }
      },
      "unlimited_soap": { 
        text: "Unlimited SOAP notes", 
        tooltip: "No monthly limits on AI-generated clinical notes", 
        tiers: {
          basic: false,
          standard: true,
          unlimited: true,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      }
    },
    "Medical Coding": {
      "code_suggestions": { 
        text: "Code suggestions", 
        tooltip: "AI-powered ICD-10 and CPT code recommendations", 
        tiers: {
          basic: false,
          standard: true,
          unlimited: true,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      },
      "code_validation": { 
        text: "Real-time code validation", 
        tooltip: "Instant validation of selected medical codes", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: true,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      },
      "searchable_db": { 
        text: "Searchable code database", 
        tooltip: "Comprehensive searchable ICD-10 and CPT code database", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: false,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      }
    },
    "EHR Integration": {
      "ehr_format": { 
        text: "EHR copy-paste format", 
        tooltip: "Notes formatted for easy copying into EHR systems", 
        tiers: {
          basic: false,
          standard: true,
          unlimited: true,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      },
      "direct_integration": { 
        text: "Direct EHR integration", 
        tooltip: "Seamless integration with Epic, Cerner, and Athenahealth", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: false,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      }
    },
    "Image Analysis": {
      "no_image": { 
        text: "No image analysis", 
        tooltip: "Image analysis feature not available", 
        tiers: {
          basic: true,
          standard: true,
          unlimited: false,
          professional: false,
          image_analysis: false,
          enterprise: false
        }
      },
      "limited_image": { 
        text: "Limited image analysis (5/month)", 
        tooltip: "Analyze up to 5 medical images per month", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: true,
          professional: true,
          image_analysis: false,
          enterprise: false
        }
      },
      "unlimited_image": { 
        text: "Unlimited image analysis", 
        tooltip: "No limits on medical image analysis", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: false,
          professional: false,
          image_analysis: true,
          enterprise: true
        }
      }
    },
    "Team Access": {
      "single_user": { 
        text: "Single user", 
        tooltip: "Access for one provider account", 
        tiers: {
          basic: true,
          standard: true,
          unlimited: true,
          professional: false,
          image_analysis: false,
          enterprise: false
        }
      },
      "team_accounts": { 
        text: "Team accounts (up to 5)", 
        tooltip: "Access for up to 5 providers", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: false,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      },
      "enterprise_accounts": { 
        text: "Unlimited team accounts", 
        tooltip: "Unlimited provider accounts", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: false,
          professional: false,
          image_analysis: false,
          enterprise: true
        }
      }
    },
    "Support": {
      "basic_support": { 
        text: "Basic support", 
        tooltip: "Email support with 48-hour response time", 
        tiers: {
          basic: true,
          standard: false,
          unlimited: false,
          professional: false,
          image_analysis: false,
          enterprise: false
        }
      },
      "standard_support": { 
        text: "Standard support", 
        tooltip: "Email and chat support with 24-hour response", 
        tiers: {
          basic: false,
          standard: true,
          unlimited: false,
          professional: false,
          image_analysis: false,
          enterprise: false
        }
      },
      "premium_support": { 
        text: "Premium support", 
        tooltip: "24/7 phone and chat support with 12-hour response", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: true,
          professional: false,
          image_analysis: false,
          enterprise: false
        }
      },
      "priority_support": { 
        text: "Priority support", 
        tooltip: "Dedicated account manager with priority response", 
        tiers: {
          basic: false,
          standard: false,
          unlimited: false,
          professional: true,
          image_analysis: true,
          enterprise: true
        }
      }
    }
  };

  const plans = {
    basic: { 
      title: "Basic", 
      price: "$19.99/month" 
    },
    standard: { 
      title: "Standard", 
      price: "$149.99/month" 
    },
    unlimited: { 
      title: "Unlimited", 
      price: "$199.99/month" 
    },
    professional: { 
      title: "Professional", 
      price: "$259.99/month",
      popular: true
    },
    image_analysis: { 
      title: "Image Analysis", 
      price: "$499.99/month" 
    },
    enterprise: { 
      title: "Enterprise", 
      price: "Contact Sales" 
    }
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
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={`transition-all duration-300 ${isExpanded ? 'max-h-full' : 'max-h-[300px] overflow-hidden'}`}>
              {Object.entries(features).map(([category, featureItems]) => (
                <>
                  <tr key={`category-${category}`} className="bg-gray-50">
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
                </>
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
