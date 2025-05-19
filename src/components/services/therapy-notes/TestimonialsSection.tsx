
import React from "react";

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">What Therapists Say</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <p className="italic mb-4 text-gray-600">
              "ConvoNotes Genius for therapy has transformed my practice. I save at least 10 hours weekly on documentation, giving me more time for client care and preventing burnout."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Dr. Rachel Thompson</h4>
                <p className="text-sm text-gray-500">Clinical Psychologist, New York</p>
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <p className="italic mb-4 text-gray-600">
              "The accuracy of mental health terminology and therapeutic concepts is impressive. This tool truly understands the nuances of therapy sessions."
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
              <div>
                <h4 className="font-semibold">Mark Williams, LMFT</h4>
                <p className="text-sm text-gray-500">Marriage & Family Therapist, California</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
