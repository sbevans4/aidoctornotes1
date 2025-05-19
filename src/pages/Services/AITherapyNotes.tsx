
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AITherapyNotes = () => {
  const navigate = useNavigate();

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
      </div>
    </>
  );
};

export default AITherapyNotes;
