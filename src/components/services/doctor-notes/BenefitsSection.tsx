
import React from "react";
import { CheckCircle, Clock, Clipboard, Laptop, Lock, Stethoscope, ClipboardCheck, Brain, ChartLine } from "lucide-react";

interface Benefit {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

export const BenefitsSection: React.FC = () => {
  const benefits: Benefit[] = [
    {
      title: "Save Hours Daily",
      description: "Reduce documentation time by 60-80%, saving 1-2 hours every day",
      icon: Clock,
      color: "text-blue-500",
    },
    {
      title: "Hands-Free Documentation",
      description: "Capture complete patient encounters without typing or manual notes",
      icon: Clipboard,
      color: "text-emerald-500",
    },
    {
      title: "Structured SOAP Notes",
      description: "Automatically generate perfectly formatted clinical documentation",
      icon: ClipboardCheck,
      color: "text-purple-500",
    },
    {
      title: "EHR Integration",
      description: "Seamlessly connect with major electronic health record systems",
      icon: Laptop,
      color: "text-orange-500",
    },
    {
      title: "HIPAA Compliance",
      description: "End-to-end encryption ensures patient data privacy and security",
      icon: Lock,
      color: "text-red-500",
    },
    {
      title: "Clinical Accuracy",
      description: "AI trained on millions of medical documents for precise terminology",
      icon: Stethoscope,
      color: "text-cyan-500",
    },
    {
      title: "Specialty-Specific",
      description: "Tailored templates for 30+ medical specialties and subspecialties",
      icon: Brain,
      color: "text-indigo-500",
    },
    {
      title: "Quality Improvement",
      description: "Enhanced documentation quality leads to better coding and billing",
      icon: ChartLine,
      color: "text-amber-500",
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How AI Doctor Notes Benefits You</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI-powered solution transforms the way physicians document patient care,
            giving you back valuable time while improving accuracy and completeness.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 flex flex-col"
            >
              <div className={`p-3 rounded-full ${benefit.color.replace('text', 'bg')}/10 self-start mb-4`}>
                <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
              </div>
              <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
