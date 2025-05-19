
import React from "react";
import { CheckCircle } from "lucide-react";

export const BenefitsSection: React.FC = () => {
  const benefits = [
    "Save 1-2 hours daily on documentation",
    "Capture complete patient encounters without typing",
    "Generate structured SOAP notes automatically",
    "Integrate directly with your EHR system",
    "HIPAA-compliant with end-to-end encryption",
    "Improve note quality and completeness"
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">How AI Doctor Notes Benefits You</h2>
        
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-3">
              <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
              <p className="text-lg">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
