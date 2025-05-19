
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIMedicalTranscription = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>AI Medical Transcription | ConvoNotes Genius</title>
        <meta name="description" content="AI-powered medical transcription that converts doctor-patient conversations into accurate text with medical terminology." />
        <meta property="og:title" content="AI Medical Transcription | ConvoNotes Genius" />
        <meta property="og:description" content="AI-powered medical transcription that converts doctor-patient conversations into accurate text with medical terminology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/services/ai-medical-transcription" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ConvoNotes Genius AI Medical Transcription",
              "applicationCategory": "HealthcareApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "19.99",
                "priceCurrency": "USD"
              },
              "description": "AI-powered medical transcription that converts doctor-patient conversations into accurate text with medical terminology."
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
                  AI Medical Transcription: Accuracy at Scale
                </h1>
                <p className="text-xl mb-6">
                  Convert medical conversations into accurate text with proper terminology, punctuation, and speaker identification.
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
                  alt="AI Medical Transcription Interface" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIMedicalTranscription;
