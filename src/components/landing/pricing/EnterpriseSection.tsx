
import React from "react";
import { Button } from "@/components/ui/button";

export const EnterpriseSection = () => {
  return (
    <div className="text-center mt-16">
      <h3 className="text-2xl font-bold mb-4">Need Enterprise Features?</h3>
      <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
        Looking for custom features, dedicated support, or special requirements? Our enterprise plan is tailored to your organization's needs.
      </p>
      <Button 
        variant="outline" 
        size="lg" 
        onClick={() => window.location.href = "/enterprise"}
      >
        Contact Sales
      </Button>
    </div>
  );
};
