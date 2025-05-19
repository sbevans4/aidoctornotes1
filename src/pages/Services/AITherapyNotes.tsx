
import React from "react";
import { Helmet } from "react-helmet";
import { 
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  TestimonialsSection,
  CtaSection,
  PricingSection,
  FAQSection,
  ReferralSection
} from "@/components/services/therapy-notes";

const AITherapyNotes = () => {
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
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <div id="referral">
          <ReferralSection />
        </div>
        <FAQSection />
        <CtaSection />
      </div>
    </>
  );
};

export default AITherapyNotes;
