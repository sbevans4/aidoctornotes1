
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIDoctorNotes = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>AI Doctor Notes | ConvoNotes Genius</title>
        <meta name="description" content="AI-powered doctor notes that convert medical conversations into accurate clinical documentation in seconds. Save hours on paperwork daily." />
        <meta property="og:title" content="AI Doctor Notes | ConvoNotes Genius" />
        <meta property="og:description" content="AI-powered doctor notes that convert medical conversations into accurate clinical documentation in seconds. Save hours on paperwork daily." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/services/ai-doctor-notes" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ConvoNotes Genius AI Doctor Notes",
              "applicationCategory": "HealthcareApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "19.99",
                "priceCurrency": "USD"
              },
              "description": "AI-powered doctor notes that convert medical conversations into accurate clinical documentation in seconds."
            }
          `}
        </script>
      </Helmet>

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  AI Doctor Notes: Clinical Documentation in Seconds
                </h1>
                <p className="text-xl mb-6">
                  Convert medical conversations into structured SOAP notes and clinical documentation with proper medical terminology and coding suggestions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Start Free 14-Day Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/medical-documentation")}
                    className="text-white border-white hover:bg-white/10"
                  >
                    View Demo
                  </Button>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/placeholder.svg" 
                  alt="AI Doctor Notes Interface" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">SOAP Note Generation</h3>
                <p className="text-gray-600">
                  Automatically generate structured SOAP notes (Subjective, Objective, Assessment, Plan) from recorded patient conversations.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Medical Terminology Recognition</h3>
                <p className="text-gray-600">
                  Advanced AI that understands and correctly applies medical terminology across 30+ specialties and subspecialties.
                </p>
              </div>
              
              <div className="p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">EHR Integration</h3>
                <p className="text-gray-600">
                  Seamless integration with major Electronic Health Record systems including Epic, Cerner, and Allscripts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">1</div>
                <h3 className="text-xl font-semibold mb-2">Record Conversation</h3>
                <p className="text-gray-600">
                  Record your patient conversation using our secure mobile or desktop app.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">2</div>
                <h3 className="text-xl font-semibold mb-2">AI Processing</h3>
                <p className="text-gray-600">
                  Our AI analyzes the conversation, extracting key medical information and clinical details.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-xl font-bold">3</div>
                <h3 className="text-xl font-semibold mb-2">Review & Export</h3>
                <p className="text-gray-600">
                  Review the generated note, make edits if needed, and export directly to your EHR system.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
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

        {/* CTA Section */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Documentation Workflow?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of physicians saving hours every day with ConvoNotes Genius
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Start Free 14-Day Trial
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/contact")}
                className="text-white border-white hover:bg-white/10"
              >
                Contact for Enterprise
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIDoctorNotes;
