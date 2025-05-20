
import React, { useEffect } from "react";
import { SEOMeta } from "@/components/shared/SEOMeta";
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
import { useNetworkStatus } from "@/hooks/use-network-status";
import { OfflineNotification } from "@/components/ui/offline-notification";

const Index = () => {
  const { isOnline } = useNetworkStatus();

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

  // Structured data for better SEO
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "AIDoctorNotes",
      "applicationCategory": "HealthcareApplication",
      "operatingSystem": "Web",
      "offers": {
        "@type": "Offer",
        "price": "19.99",
        "priceCurrency": "USD"
      },
      "description": "AI-powered medical transcription and documentation assistant for healthcare professionals"
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "AIDoctorNotes",
      "url": "https://aidoctornotes.com",
      "logo": "https://aidoctornotes.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+1-555-123-4567",
        "contactType": "customer service"
      },
      "sameAs": [
        "https://twitter.com/aidoctornotes",
        "https://facebook.com/aidoctornotes",
        "https://linkedin.com/company/aidoctornotes"
      ]
    }
  ];

  // If user is offline, show offline notification
  if (!isOnline) {
    return <OfflineNotification />;
  }

  return (
    <>
      <SEOMeta 
        title="AIDoctorNotes - AI-Powered Medical Documentation Assistant"
        description="AI-powered medical transcription and documentation assistant that converts conversations into accurate clinical notes, saving healthcare professionals hours every day."
        keywords="AI doctor notes, AI medical transcription, clinical documentation, medical AI, SOAP notes, healthcare documentation, medical transcription software"
        ogType="website"
        ogImage="/og-image.png"
        twitterCard="summary_large_image"
        structuredData={structuredData}
      />

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
