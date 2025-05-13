
import { useState, useEffect } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import ProcedureCodes from "@/components/ProcedureCodes";
import RoleSelection from "@/components/RoleSelection";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { CTASection } from "@/components/landing/CTASection";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { Helmet } from "react-helmet";

interface ClinicalNote {
  id: string;
  created_at: string;
  content: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
  status: string;
}

const Index = () => {
  const [session, setSession] = useState<any>(null);
  const [hasSelectedRole, setHasSelectedRole] = useState(false);
  const [recentNotes, setRecentNotes] = useState<ClinicalNote[]>([]);
  const { currentSubscription } = useSubscription();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session && hasSelectedRole) {
      const fetchRecentNotes = async () => {
        const { data, error } = await supabase
          .from('clinical_notes')
          .select('id, created_at, content, status')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          toast({
            title: "Error",
            description: "Failed to fetch recent notes",
            variant: "destructive",
          });
          return;
        }

        const transformedNotes = (data || []).map(note => ({
          ...note,
          content: note.content as ClinicalNote['content']
        }));

        setRecentNotes(transformedNotes);
      };

      fetchRecentNotes();
    }
  }, [session, hasSelectedRole]);

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign in",
        variant: "destructive",
      });
    }
  };

  if (session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Helmet>
          <title>AI Doctor Notes Dashboard | Save Hours on Documentation</title>
          <meta name="description" content="Access your AI-powered medical transcription dashboard. Convert medical conversations into accurate clinical notes in real-time." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <header className="bg-medical-primary text-white py-8 px-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-2">Medical Transcription Assistant</h1>
            <p className="text-medical-light text-lg">Intelligent documentation for healthcare professionals</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {!hasSelectedRole ? (
            <div className="max-w-4xl mx-auto">
              <RoleSelection onRoleSelected={() => setHasSelectedRole(true)} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <QuickActions currentSubscription={currentSubscription} />
                <RecentActivity recentNotes={recentNotes} />
              </div>
              <div className="space-y-8">
                <ProcedureCodes />
                <VoiceRecorder />
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-light/10 to-white">
      <Helmet>
        <title>AI Doctor Notes | Save Hours on Medical Documentation | HIPAA-Compliant</title>
        <meta name="description" content="AI Doctor Notes saves healthcare professionals 2+ hours daily with HIPAA-compliant medical transcription. Convert conversations to accurate clinical notes instantly." />
        <meta name="keywords" content="AI doctor notes, medical transcription, clinical documentation, HIPAA-compliant, EHR integration" />
        <link rel="canonical" href="https://aidoctornotes.com" />
        
        {/* Open Graph / Social Media */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="AI Doctor Notes | Save Hours on Medical Documentation" />
        <meta property="og:description" content="AI-powered medical transcription that saves healthcare professionals 2+ hours daily. HIPAA-compliant with EHR integration." />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        <meta property="og:url" content="https://aidoctornotes.com" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Doctor Notes | Save Hours on Documentation" />
        <meta name="twitter:description" content="AI-powered medical transcription that saves healthcare professionals 2+ hours daily." />
        <meta name="twitter:image" content="https://aidoctornotes.com/twitter-image.png" />
        
        {/* Schema.org markup for Google */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "AI Doctor Notes",
              "applicationCategory": "HealthcareApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "49.00",
                "priceCurrency": "USD"
              },
              "description": "AI-powered medical transcription that converts conversations into accurate clinical notes in real-time.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "127"
              }
            }
          `}
        </script>
      </Helmet>
      
      <HeroSection handleLogin={handleLogin} />
      <FeaturesSection />
      <PricingSection handleLogin={handleLogin} />
      <CTASection handleLogin={handleLogin} />
    </div>
  );
};

export default Index;
