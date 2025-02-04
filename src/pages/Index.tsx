import { useState, useEffect } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import ProcedureCodes from "@/components/ProcedureCodes";
import RoleSelection from "@/components/RoleSelection";
import PersonalizationSettings from "@/components/PersonalizationSettings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, FileText, CreditCard, Headset, ChartBar, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "@/hooks/useSubscription";

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
  const navigate = useNavigate();
  const { currentSubscription, plans } = useSubscription();

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
      <div className="min-h-screen bg-gray-50">
        <header className="bg-medical-primary text-white py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-semibold">Medical Transcription Assistant</h1>
            <p className="text-medical-light mt-2">Intelligent documentation for healthcare professionals</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 py-8">
          {!hasSelectedRole ? (
            <RoleSelection onRoleSelected={() => setHasSelectedRole(true)} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                  <div className="space-y-4">
                    <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                      <Mic className="w-4 h-4" />
                      Start New Recording
                    </Button>
                    <PersonalizationSettings />
                    <Button
                      className="w-full flex items-center justify-center gap-2"
                      variant="outline"
                      onClick={() => navigate("/subscription-plans")}
                    >
                      <CreditCard className="w-4 h-4" />
                      {currentSubscription ? "Manage Subscription" : "Choose a Plan"}
                    </Button>
                  </div>
                </Card>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  {recentNotes.length > 0 ? (
                    <div className="space-y-4">
                      {recentNotes.map((note) => (
                        <div key={note.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">
                                SOAP Note
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(note.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 capitalize">
                            {note.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No recent notes found</p>
                  )}
                </Card>
              </div>
              <ProcedureCodes />
              <VoiceRecorder />
            </>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-light to-white">
      {/* Hero Section */}
      <header className="bg-medical-primary text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Medical Transcription Made Simple
            </h1>
            <p className="text-xl mb-8">
              Transform your medical conversations into accurate, structured clinical notes with AI-powered transcription
            </p>
            <Button
              size="lg"
              onClick={handleLogin}
              className="bg-white text-medical-primary hover:bg-gray-100"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center">
              <Headset className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
              <h3 className="text-xl font-semibold mb-2">Real-time Transcription</h3>
              <p className="text-gray-600">
                Instantly convert medical conversations into text with high accuracy
              </p>
            </Card>
            <Card className="p-6 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
              <h3 className="text-xl font-semibold mb-2">SOAP Note Generation</h3>
              <p className="text-gray-600">
                Automatically structure notes in SOAP format with AI assistance
              </p>
            </Card>
            <Card className="p-6 text-center">
              <ChartBar className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
              <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
              <p className="text-gray-600">
                Track productivity and gain insights from your documentation
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Flexible Plans for Every Practice</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.slice(0, 3).map((plan) => (
              <Card key={plan.id} className="p-6">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold mb-4">
                  ${plan.price}
                  <span className="text-sm font-normal text-gray-600">
                    {plan.name === "Pay-As-You-Go" ? "/minute" : "/month"}
                  </span>
                </div>
                <ul className="space-y-3 mb-6">
                  {(plan.features as string[]).slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={handleLogin}
                >
                  Get Started
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-medical-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Transform Your Medical Documentation?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals who are saving time and improving accuracy with our AI-powered transcription service
          </p>
          <Button
            size="lg"
            onClick={handleLogin}
            className="bg-white text-medical-primary hover:bg-gray-100"
          >
            Start Your Free Trial
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;