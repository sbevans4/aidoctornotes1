
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { HeroSection } from "@/components/landing/HeroSection";
import { ServicesSection } from "@/components/landing/ServicesSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { IntegrationsSection } from "@/components/landing/IntegrationsSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import { FeaturedBlogPosts } from "@/components/blog/FeaturedBlogPosts";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/medical-documentation`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Error",
        description: "Failed to login. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Track page view for analytics
  useEffect(() => {
    console.log("Homepage viewed");
    // This would be where you'd implement actual analytics tracking
  }, []);

  return (
    <>
      <Helmet>
        <title>ConvoNotes Genius - AI-Powered Medical Documentation Assistant</title>
        <meta name="description" content="AI-powered medical transcription and documentation assistant that converts conversations into accurate clinical notes, saving healthcare professionals hours every day." />
        <meta name="keywords" content="AI doctor notes, AI medical transcription, clinical documentation, medical AI, SOAP notes, healthcare documentation, medical transcription software" />
        
        {/* Open Graph / Social Media Tags */}
        <meta property="og:title" content="ConvoNotes Genius - AI-Powered Medical Documentation Assistant" />
        <meta property="og:description" content="AI-powered medical transcription that saves healthcare professionals hours on documentation every day." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ConvoNotes Genius - Save Hours on Medical Documentation" />
        <meta name="twitter:description" content="AI-powered medical transcription that converts conversations into accurate clinical notes." />
        <meta name="twitter:image" content="https://aidoctornotes.com/og-image.png" />
        
        {/* Schema.org markup for Google */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ConvoNotes Genius",
              "applicationCategory": "HealthcareApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "19.99",
                "priceCurrency": "USD"
              },
              "description": "AI-powered medical transcription and documentation assistant for healthcare professionals"
            }
          `}
        </script>
        
        {/* Canonical URL to prevent duplicate content issues */}
        <link rel="canonical" href="https://aidoctornotes.com" />
      </Helmet>

      <main>
        <HeroSection handleLogin={handleLogin} />
        <ServicesSection />
        <FeaturesSection />
        <TestimonialsSection />
        <IntegrationsSection />
        <FeaturedBlogPosts />
        <PricingSection handleLogin={handleLogin} />
        <FAQSection />
        <CTASection handleLogin={handleLogin} />
      </main>
    </>
  );
};

export default Index;
