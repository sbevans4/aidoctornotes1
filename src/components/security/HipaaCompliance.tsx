
import React from "react";
import { Check } from "lucide-react";

const HipaaCompliance: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">HIPAA Compliance</h2>
            <p className="text-lg text-gray-600">
              ConvoNotes Genius is designed to meet all requirements of the Health Insurance Portability and Accountability Act (HIPAA).
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
            <h3 className="text-xl font-bold mb-6">Our HIPAA Compliance Framework</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Business Associate Agreement</h4>
                  <p className="text-gray-600">We provide a BAA for all customers, outlining our responsibilities for safeguarding PHI.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Security Risk Assessment</h4>
                  <p className="text-gray-600">Regular comprehensive risk analyses to identify and mitigate potential vulnerabilities.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Access Controls & Audit Trails</h4>
                  <p className="text-gray-600">Detailed tracking of all system access and data interactions with comprehensive audit logs.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Data Encryption</h4>
                  <p className="text-gray-600">All patient data is encrypted both in transit and at rest using industry-leading encryption standards.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Emergency Access Procedures</h4>
                  <p className="text-gray-600">Contingency plans to ensure PHI availability during emergencies while maintaining security.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HipaaCompliance;
