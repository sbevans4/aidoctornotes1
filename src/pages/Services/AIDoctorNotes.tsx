
import React from "react";
import { Helmet } from "react-helmet";
import { HeroSection } from "@/components/services/doctor-notes/HeroSection";
import { BenefitsSection } from "@/components/services/doctor-notes/BenefitsSection";
import { HowItWorksSection } from "@/components/services/doctor-notes/HowItWorksSection";
import { FeaturesSection } from "@/components/services/doctor-notes/FeaturesSection";
import { TestimonialsSection } from "@/components/services/doctor-notes/TestimonialsSection";
import { CtaSection } from "@/components/services/doctor-notes/CtaSection";

const AIDoctorNotes = () => {
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
        <HeroSection />
        <BenefitsSection />
        <HowItWorksSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </div>
    </>
  );
};

export default AIDoctorNotes;
