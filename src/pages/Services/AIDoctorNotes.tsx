
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, FileText, Clock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIDoctorNotes = () => {
  const navigate = useNavigate();

  const benefits = [
    "Save 1-2 hours daily on documentation",
    "Capture complete patient encounters without typing",
    "Generate structured SOAP notes automatically",
    "Integrate directly with your EHR system",
    "HIPAA-compliant with end-to-end encryption",
    "Improve note quality and completeness"
  ];

  const features = [
    {
      icon: FileText,
      title: "Structured Documentation",
      description: "Our AI generates complete SOAP notes with proper formatting, sections, and medical terminology."
    },
    {
      icon: Clock,
      title: "Real-Time Processing",
      description: "Notes are generated during or immediately after the patient encounter, no waiting or batch processing."
    },
    {
      icon: ShieldCheck,
      title: "HIPAA Compliance",
      description: "End-to-end encryption and secure processing ensures patient data remains protected."
    }
  ];

  return (
    <>
      <Helmet>
        <title>AI Doctor Notes | AIDoctorNotes</title>
        <meta name="description" content="AI-powered doctor notes that convert medical conversations into accurate clinical documentation in seconds. Save hours on paperwork daily." />
        <meta property="og:title" content="AI Doctor Notes | AIDoctorNotes" />
        <meta property="og:description" content="AI-powered doctor notes that convert medical conversations into accurate clinical documentation in seconds. Save hours on paperwork daily." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/services/ai-doctor-notes" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AIDoctorNotes AI Doctor Notes",
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
                  AI Doctor Notes: Automate Your Documentation
                </h1>
                <p className="text-xl mb-6">
                  Transform patient conversations into accurate clinical documentation in seconds, saving you hours every day.
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

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">How AI Doctor Notes Benefits You</h2>
            
            <div className="grid md:grid-cols-2 gap-x-12 gap-y-8 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-lg">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
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

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4 text-center">Key Features</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto text-center mb-12">
              Our AI doctor notes platform includes everything you need for efficient documentation
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Save Hours on Documentation?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals already using ConvoNotes Genius to reduce their documentation burden
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
                onClick={() => navigate("/enterprise")}
                className="text-white border-white hover:bg-white/10"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIDoctorNotes;
