
import React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-4 text-center">How It Works</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
          Our AI doctor notes solution seamlessly fits into your existing workflow
        </p>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-blue-600"></div>
            
            {/* Steps */}
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="flex md:justify-end md:w-1/2 md:pr-8 mb-4 md:mb-0">
                  <div className="bg-white p-6 rounded-lg shadow-md md:text-right">
                    <h3 className="text-xl font-bold mb-2">Record the Conversation</h3>
                    <p className="text-gray-600">
                      Simply start the recording during your patient encounter, using your computer, smartphone, or our dedicated device.
                    </p>
                  </div>
                </div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center transform md:-translate-x-1/2">
                  1
                </div>
                <div className="md:w-1/2 md:pl-8"></div>
              </div>
              
              {/* Step 2 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8"></div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center transform md:-translate-x-1/2">
                  2
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">AI Processes Audio</h3>
                    <p className="text-gray-600">
                      Our medical-grade AI transcribes the conversation and identifies key clinical information in real-time.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Step 3 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="flex md:justify-end md:w-1/2 md:pr-8 mb-4 md:mb-0">
                  <div className="bg-white p-6 rounded-lg shadow-md md:text-right">
                    <h3 className="text-xl font-bold mb-2">Structured SOAP Note Generated</h3>
                    <p className="text-gray-600">
                      The AI organizes information into a properly formatted SOAP note with subjective, objective, assessment, and plan sections.
                    </p>
                  </div>
                </div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center transform md:-translate-x-1/2">
                  3
                </div>
                <div className="md:w-1/2 md:pl-8"></div>
              </div>
              
              {/* Step 4 */}
              <div className="relative flex flex-col md:flex-row items-center">
                <div className="md:w-1/2 md:pr-8"></div>
                <div className="absolute left-0 md:left-1/2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center transform md:-translate-x-1/2">
                  4
                </div>
                <div className="md:w-1/2 md:pl-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-bold mb-2">Review and Export</h3>
                    <p className="text-gray-600">
                      Review the note, make any edits if needed, and export directly to your EHR system with one click.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
