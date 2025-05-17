
import React, { useState } from "react";
import RoleSelection from "@/components/RoleSelection";
import { OnboardingTour } from "@/components/auth/OnboardingTour";
import { MainAuthInterface } from "@/components/auth/MainAuthInterface";

const Auth = () => {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [showTour, setShowTour] = useState<boolean>(false);

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
          <MainAuthInterface
            onSelectPlan={handleSelectPlan}
            authMode={authMode}
            setAuthMode={setAuthMode}
          />
        )}
      </div>
    </div>
  );
};

export default Auth;
