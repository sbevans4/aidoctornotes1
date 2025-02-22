
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
      <HeroSection handleLogin={handleLogin} />
      <FeaturesSection />
      <PricingSection handleLogin={handleLogin} />
      <CTASection handleLogin={handleLogin} />
    </div>
  );
};

export default Index;

