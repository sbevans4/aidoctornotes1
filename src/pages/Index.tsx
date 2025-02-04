import { useState, useEffect } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import ProcedureCodes from "@/components/ProcedureCodes";
import RoleSelection from "@/components/RoleSelection";
import PersonalizationSettings from "@/components/PersonalizationSettings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, FileText, CreditCard } from "lucide-react";
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
  const [hasSelectedRole, setHasSelectedRole] = useState(false);
  const [recentNotes, setRecentNotes] = useState<ClinicalNote[]>([]);
  const navigate = useNavigate();
  const { currentSubscription } = useSubscription();

  useEffect(() => {
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

    if (hasSelectedRole) {
      fetchRecentNotes();
    }
  }, [hasSelectedRole]);

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
};

export default Index;