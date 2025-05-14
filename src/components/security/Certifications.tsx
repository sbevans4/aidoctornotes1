
import React from "react";
import { Award } from "lucide-react";

const Certifications: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Certifications</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            ConvoNotes Genius maintains rigorous compliance with industry standards and regulations.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Award className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="font-semibold text-center">HIPAA Compliant</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Award className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="font-semibold text-center">SOC 2 Type II</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Award className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="font-semibold text-center">ISO 27001</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <Award className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="font-semibold text-center">GDPR Compliant</h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
