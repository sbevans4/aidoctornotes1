
import React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">1</div>
            <h3 className="text-xl font-semibold mb-2">Record Session</h3>
            <p className="text-gray-600">
              Record your therapy session using our secure mobile or desktop app with client consent.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">2</div>
            <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
            <p className="text-gray-600">
              Our specialized mental health AI analyzes the session, extracting key therapeutic insights and clinical details.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">3</div>
            <h3 className="text-xl font-semibold mb-2">Review & Export</h3>
            <p className="text-gray-600">
              Review the generated therapy notes, make edits if needed, and export directly to your practice management system.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
