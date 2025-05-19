
import { useState } from "react";
import { Scroll, Mic, Brain, Gift, Percent, Check, Info, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentForm } from "@/components/PaymentForm";
import { useSubscription } from "@/hooks/useSubscription";
import { useReferral } from "@/hooks/useReferral";
import { FeaturesComparison } from "./FeaturesComparison";
import { KeyFeatures } from "./pricing/KeyFeatures";
import { PricingCard } from "./pricing/PricingCard";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";

interface PricingSectionProps {
  handleLogin: () => Promise<void>;
}

export const FeaturesSection = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

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
      price: "$19.99/month",
      description: "Perfect for solo practitioners getting started with AI documentation."
    },
    standard: { 
      title: "Standard", 
      price: "$149.99/month",
      description: "Everything in Basic plus unlimited notes and coding features.",
      includesText: "Everything in Basic +"
    },
    unlimited: { 
      title: "Unlimited", 
      price: "$199.99/month",
      description: "Everything in Standard plus advanced features and limited image analysis.",
      includesText: "Everything in Standard +"
    },
    professional: { 
      title: "Professional", 
      price: "$259.99/month",
      popular: true,
      description: "Everything in Unlimited plus EHR integration and team accounts.",
      includesText: "Everything in Unlimited +"
    },
    image_analysis: { 
      title: "Image Analysis", 
      price: "$499.99/month",
      description: "Everything in Professional plus unlimited image analysis for specialists.",
      includesText: "Everything in Professional +"
    },
    enterprise: { 
      title: "Enterprise", 
      price: "Contact Sales",
      description: "Custom enterprise solution with unlimited everything and dedicated support.",
      includesText: "Everything in Image Analysis +"
    }
  };

  // Testimonials for social proof
  const testimonials = [
    {
      quote: "AIDoctorNotes saves me nearly 2 hours every day on documentation. The Professional plan is worth every penny.",
      author: "Dr. Emily Chen",
      specialty: "Family Medicine",
      plan: "Professional"
    },
    {
      quote: "The image analysis feature has transformed how I document dermatological findings. Extremely accurate and time-saving.",
      author: "Dr. Michael Johnson",
      specialty: "Dermatology",
      plan: "Image Analysis"
    },
    {
      quote: "Team accounts have made our practice workflow so much more efficient. We can collaborate seamlessly.",
      author: "Dr. Sarah Williams",
      specialty: "Internal Medicine",
      plan: "Professional"
    }
  ];

  // Function to filter plans for mobile view
  const getActivePlans = () => {
    if (activeTab === "all") return tierOrder;
    if (activeTab === "popular") return ["professional"];
    if (activeTab === "basic") return ["basic", "standard"];
    if (activeTab === "advanced") return ["unlimited", "professional", "image_analysis"];
    return tierOrder;
  };

  return (
    <section className="py-16 bg-gray-50" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Compare Plans</h2>
        <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
          Choose the plan that best fits your practice needs. All higher-tier plans include features from lower tiers.
        </p>

        {/* Urgency Banner - Behavioral Economics */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-amber-100 border border-amber-200 rounded-lg p-4 flex items-center justify-between gap-2 text-amber-700">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span className="font-semibold">
                Limited time offer: Try Professional free for 7 days! No credit card required.
              </span>
            </div>
            <Button 
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white border-none"
            >
              Start Free Trial
            </Button>
          </div>
        </div>
        
        {/* Mobile View - Tab Navigation for Plans */}
        <div className="md:hidden mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="popular">Popular</TabsTrigger>
              <TabsTrigger value="basic">Basic</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Desktop View - Full Comparison Table */}
        <div className="hidden md:block overflow-x-auto">
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

        {/* Mobile View - Plan Cards */}
        <div className="md:hidden">
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

        {/* Expand/Collapse for Desktop View */}
        {!isExpanded && (
          <div className="text-center mt-4 hidden md:block">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(true)}
              className="text-sm"
            >
              Show All Features <ChevronDown className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}

        {isExpanded && (
          <div className="text-center mt-4 hidden md:block">
            <Button
              variant="outline"
              onClick={() => setIsExpanded(false)}
              className="text-sm"
            >
              Collapse Features <ChevronUp className="ml-1 h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Testimonials Section - Social Proof */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-center mb-8">What Our Users Say</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.specialty}</p>
                  <p className="text-sm text-blue-600 mt-1">
                    <span className="font-medium">{testimonial.plan}</span> plan user
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call To Action */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-3">Ready to streamline your documentation workflow?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who save hours every day with AIDoctorNotes.
          </p>
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
