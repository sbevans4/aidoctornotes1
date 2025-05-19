
import React from "react";
import { Helmet } from "react-helmet";
import { 
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  CtaSection 
} from "@/components/services/doctor-notes";

const AIDoctorNotes = () => {
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
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </>
  );
};

export default AIDoctorNotes;
