
import React from "react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">What Physicians Say</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <p className="italic mb-4 text-gray-600">
              "ConvoNotes Genius has changed my workflow completely. I save at least 2 hours daily on documentation, giving me more time with patients and for myself."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Dr. Sarah Johnson</h4>
                <p className="text-sm text-gray-500">Family Medicine, Boston</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <p className="italic mb-4 text-gray-600">
              "The accuracy of the medical terminology and coding suggestions is impressive. I've tried other AI tools but this one truly understands medical contexts."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Dr. Michael Chen</h4>
                <p className="text-sm text-gray-500">Cardiologist, Chicago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
