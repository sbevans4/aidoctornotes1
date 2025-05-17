
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { TranscriptionPlans } from "@/components/auth/TranscriptionPlans";
import { AINotesPlans } from "@/components/auth/AINotesPlans";
import { TherapyNotesPlans } from "@/components/auth/TherapyNotesPlans";
import { DocumentationExample } from "@/components/auth/DocumentationExample";
import { EnterpriseCTA } from "@/components/auth/EnterpriseCTA";
import { RoleSelection } from "@/components/RoleSelection";
import { OnboardingTour } from "@/components/auth/OnboardingTour";

interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  type: string;
}

const Auth = () => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showTour, setShowTour] = useState<boolean>(false);

  // Mock plans data - would come from API in real app
  const aiNotesPlansMock: Plan[] = [
    {
      id: "ai-notes-trial",
      name: "Trial",
      price: 0,
      features: [
        "14-day free access",
        "Basic AI note generation",
        "5 notes per month",
        "Standard templates",
      ],
      type: "ai-notes",
    },
    {
      id: "ai-notes-standard",
      name: "Pro",
      price: 29.99,
      features: [
        "Unlimited AI note generation",
        "All medical specialties",
        "Custom templates",
        "Priority processing",
        "Premium support",
      ],
      type: "ai-notes",
    },
    {
      id: "ai-notes-premium",
      name: "Enterprise",
      price: 99.99,
      features: [
        "All Pro features",
        "Team accounts",
        "Advanced analytics",
        "API access",
        "Dedicated account manager",
        "Custom integrations",
      ],
      type: "ai-notes",
    },
  ];

  const therapyNotesPlansMock: Plan[] = [
    {
      id: "therapy-notes-trial",
      name: "Trial",
      price: 0,
      features: [
        "14-day free access",
        "Basic therapy notes",
        "5 sessions per month",
        "Standard therapy templates",
        "Basic progress tracking"
      ],
      type: "therapy-notes",
    },
    {
      id: "therapy-notes-professional",
      name: "Professional",
      price: 39.99,
      features: [
        "Unlimited sessions",
        "Specialized therapy templates (CBT, DBT, etc.)",
        "Treatment plan generator",
        "Client progress visualization",
        "Insurance-ready documentation",
        "HIPAA compliant storage"
      ],
      type: "therapy-notes",
    },
    {
      id: "therapy-notes-group",
      name: "Group Practice",
      price: 119.99,
      features: [
        "All Professional features",
        "Multiple therapist accounts",
        "Practice management tools",
        "Client portal access",
        "Supervision notes",
        "Advanced analytics dashboard",
        "Customizable assessment tools"
      ],
      type: "therapy-notes",
    },
  ];

  const transcriptionPlansMock: Plan[] = [
    {
      id: "transcription-basic",
      name: "Basic",
      price: 19.99,
      features: [
        "100 minutes/month",
        "Standard accuracy",
        "24-hour turnaround",
        "Basic speaker identification",
      ],
      type: "transcription",
    },
    {
      id: "transcription-pro",
      name: "Pro",
      price: 49.99,
      features: [
        "500 minutes/month",
        "Enhanced accuracy",
        "4-hour turnaround",
        "Advanced speaker identification",
        "Medical terminology support",
        "Custom vocabulary",
      ],
      type: "transcription",
    },
    {
      id: "transcription-unlimited",
      name: "Unlimited",
      price: 99.99,
      features: [
        "Unlimited minutes",
        "Highest accuracy",
        "1-hour turnaround",
        "Priority processing",
        "Full medical terminology support",
        "Custom templates",
        "API access",
      ],
      type: "transcription",
    },
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    setAuthMode("signup");
  };

  const handleRoleSelected = (role: string) => {
    setSelectedRole(role);
    if (role === "new") {
      setShowTour(true);
    }
  };

  const handleTourComplete = () => {
    setShowTour(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl w-full space-y-8">
        {!selectedRole ? (
          <RoleSelection onRoleSelected={handleRoleSelected} />
        ) : showTour ? (
          <OnboardingTour onComplete={handleTourComplete} />
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="md:flex">
              {/* Left side - Plan selection */}
              <div className="md:w-3/5 p-8 bg-gray-50">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Choose Your Plan
                </h2>
                <Tabs defaultValue="ai-notes">
                  <TabsList className="mb-8 bg-transparent border-b border-gray-200 w-full flex justify-start">
                    <TabsTrigger
                      value="ai-notes"
                      className="text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      AI Doctor Notes
                    </TabsTrigger>
                    <TabsTrigger
                      value="therapy-notes"
                      className="text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Therapy Notes
                    </TabsTrigger>
                    <TabsTrigger
                      value="transcription"
                      className="text-sm rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
                    >
                      Medical Transcription
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="ai-notes">
                    <AINotesPlans
                      plans={aiNotesPlansMock}
                      onSelectPlan={handleSelectPlan}
                    />
                  </TabsContent>
                  
                  <TabsContent value="therapy-notes">
                    <TherapyNotesPlans
                      plans={therapyNotesPlansMock}
                      onSelectPlan={handleSelectPlan}
                    />
                  </TabsContent>

                  <TabsContent value="transcription">
                    <TranscriptionPlans
                      plans={transcriptionPlansMock}
                      onSelectPlan={handleSelectPlan}
                    />
                  </TabsContent>
                </Tabs>

                <hr className="my-8" />
                <EnterpriseCTA />
              </div>

              {/* Right side - Auth forms */}
              <div className="md:w-2/5 p-8 border-l">
                <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as any)}>
                  <TabsList className="mb-6 w-full">
                    <TabsTrigger value="signin" className="flex-1">
                      Sign In
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="flex-1">
                      Sign Up
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <SignInForm />
                  </TabsContent>

                  <TabsContent value="signup">
                    <SignUpForm selectedPlan={selectedPlan} />
                  </TabsContent>
                </Tabs>

                <div className="mt-8">
                  <DocumentationExample />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
