
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description: string;
  features: PlanFeature[];
  tier: string;
  priceId: string;
  billingPeriod: 'monthly' | 'annually';
}

export default function SubscriptionPlans() {
  const { user, subscriptionStatus } = useAuth();
  const { subscribeToPlan } = useSubscription();
  const [isCreatingCheckout, setIsCreatingCheckout] = useState<string | null>(null);
  const [activePeriod, setActivePeriod] = useState<'monthly' | 'annually'>('monthly');
  const { toast } = useToast();

  // Sample plans - in a real app, these would come from the database
  const plans: SubscriptionPlan[] = [
    {
      id: "basic",
      name: "Basic",
      price: activePeriod === 'monthly' ? 19.99 : 199.99,
      description: "Essential features for individual practitioners",
      tier: "basic",
      priceId: activePeriod === 'monthly' ? "price_basic_monthly" : "price_basic_annual",
      billingPeriod: activePeriod,
      features: [
        { name: "Voice-to-text transcription", included: true },
        { name: "SOAP note generation", included: true },
        { name: "20 notes per month", included: true },
        { name: "Basic templates", included: true },
        { name: "Email support", included: true },
        { name: "Procedure code suggestion", included: false },
        { name: "Unlimited notes", included: false },
        { name: "Advanced templates", included: false },
        { name: "Priority support", included: false },
      ],
    },
    {
      id: "standard",
      name: "Standard",
      price: activePeriod === 'monthly' ? 39.99 : 399.99,
      description: "Advanced features for busy practitioners",
      tier: "standard",
      priceId: activePeriod === 'monthly' ? "price_standard_monthly" : "price_standard_annual",
      billingPeriod: activePeriod,
      features: [
        { name: "Voice-to-text transcription", included: true },
        { name: "SOAP note generation", included: true },
        { name: "50 notes per month", included: true },
        { name: "Basic templates", included: true },
        { name: "Email support", included: true },
        { name: "Procedure code suggestion", included: true },
        { name: "Customizable templates", included: true },
        { name: "Chart integration", included: true },
        { name: "Priority support", included: false },
      ],
    },
    {
      id: "professional",
      name: "Professional",
      price: activePeriod === 'monthly' ? 79.99 : 799.99,
      description: "Complete solution for medical practices",
      tier: "professional",
      priceId: activePeriod === 'monthly' ? "price_professional_monthly" : "price_professional_annual",
      billingPeriod: activePeriod,
      features: [
        { name: "Voice-to-text transcription", included: true },
        { name: "SOAP note generation", included: true },
        { name: "Unlimited notes", included: true },
        { name: "All templates", included: true },
        { name: "Priority support", included: true },
        { name: "Procedure code suggestion", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Team access (up to 5)", included: true },
        { name: "Custom branding", included: false },
      ],
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: activePeriod === 'monthly' ? 199.99 : 1999.99,
      description: "Custom solutions for healthcare organizations",
      tier: "enterprise",
      priceId: activePeriod === 'monthly' ? "price_enterprise_monthly" : "price_enterprise_annual",
      billingPeriod: activePeriod,
      features: [
        { name: "Voice-to-text transcription", included: true },
        { name: "SOAP note generation", included: true },
        { name: "Unlimited notes", included: true },
        { name: "All templates", included: true },
        { name: "Priority support", included: true },
        { name: "Procedure code suggestion", included: true },
        { name: "Advanced analytics", included: true },
        { name: "Unlimited team access", included: true },
        { name: "Custom branding", included: true },
        { name: "Dedicated account manager", included: true },
        { name: "Custom integrations", included: true },
      ],
    },
  ];

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan.",
        variant: "destructive"
      });
      return;
    }

    setIsCreatingCheckout(planId);

    try {
      // This would normally call a server endpoint to create a checkout session
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: plans.find(p => p.id === planId)?.priceId,
          userId: user.id,
          customerEmail: user.email,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Subscription error",
        description: error.message || "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCheckout(null);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) return;

    setIsCreatingCheckout("manage");

    try {
      const { data, error } = await supabase.functions.invoke("customer-portal", {});

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error: any) {
      console.error("Customer portal error:", error);
      toast({
        title: "Portal access error",
        description: error.message || "Failed to access subscription management. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCheckout(null);
    }
  };

  return (
    <>
      <Helmet>
        <title>Subscription Plans | AIDoctorNotes</title>
      </Helmet>
      
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">Subscription Plans</h1>
        <p className="text-muted-foreground mb-8">
          Choose the plan that best fits your needs. All plans include our core features.
        </p>
        
        <div className="flex justify-end mb-6">
          <Tabs 
            value={activePeriod} 
            onValueChange={(v) => setActivePeriod(v as 'monthly' | 'annually')}
            className="bg-background shadow-sm border rounded-lg"
          >
            <TabsList className="grid grid-cols-2 w-[260px]">
              <TabsTrigger value="monthly">Monthly Billing</TabsTrigger>
              <TabsTrigger value="annually">
                Annual <Badge variant="secondary" className="ml-2">Save 15%</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const isCurrentPlan = subscriptionStatus.tier === plan.tier;
            
            return (
              <Card 
                key={plan.id}
                className={`${
                  isCurrentPlan ? 'border-primary border-2 shadow-md' : ''
                } flex flex-col`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                    </div>
                    {isCurrentPlan && (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="mb-6">
                    <span className="text-3xl font-bold">${plan.price}</span>
                    <span className="text-muted-foreground">/{activePeriod === 'monthly' ? 'month' : 'year'}</span>
                  </div>
                  
                  <ul className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className={`mr-2 mt-0.5 ${feature.included ? 'text-green-500' : 'text-gray-300'}`}>
                          <Check className="h-5 w-5" />
                        </span>
                        <span className={feature.included ? '' : 'text-muted-foreground line-through'}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isCurrentPlan ? (
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={handleManageSubscription}
                      disabled={isCreatingCheckout === "manage"}
                    >
                      {isCreatingCheckout === "manage" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Manage Subscription"
                      )}
                    </Button>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleSubscribe(plan.id)}
                      disabled={!!isCreatingCheckout}
                    >
                      {isCreatingCheckout === plan.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        subscriptionStatus.tier 
                          ? (plan.price > (plans.find(p => p.tier === subscriptionStatus.tier)?.price || 0)
                            ? "Upgrade"
                            : "Subscribe")
                          : "Subscribe"
                      )}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
        
        <div className="mt-12 bg-muted/30 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Enterprise Solutions</h2>
          <p className="mb-4">
            Need a custom solution for your healthcare organization? Our enterprise plan
            can be tailored to your specific needs.
          </p>
          <Button variant="outline" onClick={() => window.location.href = "mailto:enterprise@aidoctornotes.com"}>
            Contact Sales
          </Button>
        </div>
      </div>
    </>
  );
}
