
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TranscriptionPlans } from "@/components/auth/TranscriptionPlans";
import { AINotesPlans } from "@/components/auth/AINotesPlans";
import { TherapyNotesPlans } from "@/components/auth/TherapyNotesPlans";
import { EnterpriseCTA } from "@/components/auth/EnterpriseCTA";
import { WithLoading } from "@/components/ui/with-loading";

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  type: string;
}

interface PlanSelectionProps {
  onSelectPlan: (planId: string) => void;
  aiNotesPlansMock: Plan[];
  therapyNotesPlansMock: Plan[];
  transcriptionPlansMock: Plan[];
  isLoading?: boolean;
}

export const PlanSelection = ({
  onSelectPlan,
  aiNotesPlansMock,
  therapyNotesPlansMock,
  transcriptionPlansMock,
  isLoading = false
}: PlanSelectionProps) => {
  return (
    <WithLoading 
      isLoading={isLoading} 
      data={{
        aiNotesPlansMock,
        therapyNotesPlansMock,
        transcriptionPlansMock
      }}
      loadingMessage="Loading subscription plans..."
    >
      {(data) => (
        <>
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
                plans={data.aiNotesPlansMock}
                onSelectPlan={onSelectPlan}
              />
            </TabsContent>
            
            <TabsContent value="therapy-notes">
              <TherapyNotesPlans
                plans={data.therapyNotesPlansMock}
                onSelectPlan={onSelectPlan}
              />
            </TabsContent>

            <TabsContent value="transcription">
              <TranscriptionPlans
                plans={data.transcriptionPlansMock}
                onSelectPlan={onSelectPlan}
              />
            </TabsContent>
          </Tabs>

          <hr className="my-8" />
          <EnterpriseCTA />
        </>
      )}
    </WithLoading>
  );
};
