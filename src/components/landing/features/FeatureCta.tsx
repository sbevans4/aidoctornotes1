
import React from "react";
import { Button } from "@/components/ui/button";

export const FeatureCta = () => {
  return (
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
  );
};
