
import React from "react";
import { FileText, Clock, ShieldCheck } from "lucide-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: FileText,
      title: "Structured Documentation",
      description: "Our AI generates complete SOAP notes with proper formatting, sections, and medical terminology."
    },
    {
      icon: Clock,
      title: "Real-Time Processing",
      description: "Notes are generated during or immediately after the patient encounter, no waiting or batch processing."
    },
    {
      icon: ShieldCheck,
      title: "HIPAA Compliance",
      description: "End-to-end encryption and secure processing ensures patient data remains protected."
    }
  ];
  
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">Key Features</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
          Our AI doctor notes platform includes everything you need for efficient documentation
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
