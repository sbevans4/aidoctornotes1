
import { useState } from "react";
import { PlanSelection } from "./PlanSelection";
import { AuthForms } from "./AuthForms";
import { aiNotesPlansMock, therapyNotesPlansMock, transcriptionPlansMock } from "./planData";

interface MainAuthInterfaceProps {
  onSelectPlan: (planId: string) => void;
  authMode: "signin" | "signup";
  setAuthMode: (mode: "signin" | "signup") => void;
}

export const MainAuthInterface = ({ 
  onSelectPlan, 
  authMode, 
  setAuthMode 
}: MainAuthInterfaceProps) => {
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="md:flex">
        {/* Left side - Plan selection */}
        <div className="md:w-3/5 p-8 bg-gray-50">
          <PlanSelection
            onSelectPlan={onSelectPlan}
            aiNotesPlansMock={aiNotesPlansMock}
            therapyNotesPlansMock={therapyNotesPlansMock}
            transcriptionPlansMock={transcriptionPlansMock}
          />
        </div>

        {/* Right side - Auth forms */}
        <AuthForms 
          authMode={authMode} 
          setAuthMode={setAuthMode}
        />
      </div>
    </div>
  );
};
