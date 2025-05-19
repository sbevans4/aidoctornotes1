
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PricingSection: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Choose Your Therapy Notes Plan</h2>
        
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { 
              name: 'Basic', 
              price: '$19.99/month', 
              features: ['Unlimited transcription', '5 notes/month', 'PDF export'],
              popular: false
            },
            { 
              name: 'Standard', 
              price: '$149.99/month', 
              features: ['Everything in Basic', 'Unlimited notes', 'Code suggestions'],
              popular: false
            },
            { 
              name: 'Unlimited', 
              price: '$199.99/month', 
              features: ['Everything in Standard', 'Custom templates', '5 image scans'],
              popular: false
            },
            { 
              name: 'Professional', 
              price: '$259.99/month', 
              features: ['Everything in Unlimited', 'EHR integration', 'Team accounts'],
              popular: true
            },
            { 
              name: 'Image Analysis', 
              price: '$499.99/month', 
              features: ['Everything in Professional', 'Unlimited image analysis', 'Specialist templates'],
              popular: false
            },
          ].map((plan) => (
            <div 
              key={plan.name} 
              className={`rounded-lg overflow-hidden border ${plan.popular ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}
            >
              <div className={`p-6 ${plan.popular ? 'bg-blue-50' : 'bg-white'}`}>
                {plan.popular && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <p className="text-2xl font-bold mb-4">{plan.price}</p>
                <ul className="mb-6 space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => navigate("/subscription-plans")}
                  className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                >
                  Choose Plan
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
