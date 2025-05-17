
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AITherapyNotes = () => {
  const navigate = useNavigate();

  const benefits = [
    "Save time on session documentation",
    "Create more accurate, thorough therapy notes",
    "Use templates for different therapy modalities",
    "Ensure compliance with insurance requirements",
    "Track patient progress consistently",
    "Maintain HIPAA compliance and data security"
  ];

  return (
    <>
      <Helmet>
        <title>AI Therapy Notes | ConvoNotes Genius</title>
        <meta name="description" content="AI-powered therapy notes that convert therapy sessions into accurate clinical documentation in seconds. Designed specifically for mental health professionals." />
        <meta property="og:title" content="AI Therapy Notes | ConvoNotes Genius" />
        <meta property="og:description" content="AI-powered therapy notes that convert therapy sessions into accurate clinical documentation in seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/services/ai-therapy-notes" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ConvoNotes Genius AI Therapy Notes",
              "applicationCategory": "HealthcareApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "19.99",
                "priceCurrency": "USD"
              },
              "description": "AI-powered therapy notes that convert therapy sessions into accurate clinical documentation in seconds."
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
                  AI Therapy Notes: Designed for Mental Health Professionals
                </h1>
                <p className="text-xl mb-6">
                  Convert therapy sessions into structured clinical documentation instantly, with terminology specific to mental health practice.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    onClick={() => navigate("/auth?tab=therapy-notes")}
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
                  alt="AI Therapy Notes Interface" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Benefits for Mental Health Professionals</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-gray-700">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Specialized Features for Therapists</h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">Therapy-Specific Templates</h3>
                <p className="text-gray-600">
                  Customized templates for CBT, psychodynamic therapy, family therapy, and other modalities.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">Assessment Tools</h3>
                <p className="text-gray-600">
                  Integrated mental health assessment tools and symptom tracking for consistent documentation.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">Treatment Planning</h3>
                <p className="text-gray-600">
                  AI-assisted treatment plan creation and goal tracking for better patient outcomes.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">Insurance Compliance</h3>
                <p className="text-gray-600">
                  Notes structured to meet insurance documentation requirements for mental health services.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">Progress Monitoring</h3>
                <p className="text-gray-600">
                  Track therapeutic progress over time with comparative analysis of session notes.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                <h3 className="text-xl font-bold mb-3">Client Portal</h3>
                <p className="text-gray-600">
                  Secure sharing of homework assignments and resources through an integrated client portal.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our AI therapy notes solution is designed specifically for the unique needs of mental health professionals
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">1</div>
                <h3 className="font-bold mb-2">Record Session</h3>
                <p className="text-gray-600 text-sm">Record your therapy session using our secure application</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">2</div>
                <h3 className="font-bold mb-2">AI Analysis</h3>
                <p className="text-gray-600 text-sm">Our AI transcribes and analyzes the therapeutic conversation</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">3</div>
                <h3 className="font-bold mb-2">Generate Notes</h3>
                <p className="text-gray-600 text-sm">Structured notes are created using therapy-specific templates</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 text-xl font-bold">4</div>
                <h3 className="font-bold mb-2">Review & Export</h3>
                <p className="text-gray-600 text-sm">Review, edit if needed, and export to your practice management system</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonial Section */}
        <section className="py-16 bg-blue-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-lg p-8 shadow-sm relative">
              <div className="text-6xl text-blue-200 absolute top-4 left-4">"</div>
              <div className="relative z-10">
                <p className="text-lg text-gray-700 mb-6 italic">
                  As a therapist seeing 6-8 clients daily, documentation was taking up my evenings. ConvoNotes Genius has given me back 10+ hours per week while actually improving the quality of my notes. The mental health-specific features show they truly understand our profession.
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                  <div>
                    <p className="font-bold">Dr. Rebecca Johnson</p>
                    <p className="text-gray-600">Clinical Psychologist</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Practice?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of mental health professionals already using our AI therapy notes solution
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button 
                size="lg"
                onClick={() => navigate("/auth?tab=therapy-notes")}
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
                Request a Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AITherapyNotes;
