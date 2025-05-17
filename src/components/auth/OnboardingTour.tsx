
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface OnboardingTourProps {
  onComplete?: () => void;
}

const tourSteps = [
  {
    title: "Welcome to Medical Transcription!",
    content: "Let's take a quick tour of how our AI-powered medical documentation works.",
  },
  {
    title: "Record Your Conversations",
    content: "Use our secure voice recorder to capture patient consultations. All recordings are HIPAA-compliant and encrypted.",
  },
  {
    title: "Automatic Transcription",
    content: "Our AI instantly converts your recordings into accurate text, saving you valuable time.",
  },
  {
    title: "SOAP Note Generation",
    content: "We automatically structure your transcription into professional SOAP notes with relevant procedure codes.",
  },
  {
    title: "Ready to Start?",
    content: "Choose a plan that fits your needs and start streamlining your documentation process today.",
  },
];

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem("onboardingCompleted", "true");
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible || localStorage.getItem("onboardingCompleted")) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="relative pb-4">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">{tourSteps[currentStep].title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {tourSteps[currentStep].content}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
            <Button
              size="sm"
              onClick={currentStep === tourSteps.length - 1 ? handleClose : handleNext}
            >
              {currentStep === tourSteps.length - 1 ? (
                "Get Started"
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
