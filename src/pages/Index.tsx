import { useState, useEffect } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import ProcedureCodes from "@/components/ProcedureCodes";
import RoleSelection from "@/components/RoleSelection";
import PersonalizationSettings from "@/components/PersonalizationSettings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ClinicalNote {
  id: string;
  created_at: string;
  anonymized_file_path: string | null;
  content: {
    subjective: string;
    objective: string;
    assessment: string;
    plan: string;
  };
}

const Index = () => {
  const [hasSelectedRole, setHasSelectedRole] = useState(false);
  const [recentNotes, setRecentNotes] = useState<ClinicalNote[]>([]);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      const { data, error } = await supabase
        .from('clinical_notes')
        .select('*')
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

      setRecentNotes(data);
    };

    if (hasSelectedRole) {
      fetchRecentNotes();
    }
  }, [hasSelectedRole]);

  const handleDownload = async (filePath: string) => {
    try {
      const { data, error } = await supabase.storage
        .from('anonymized-notes')
        .download(filePath);
      
      if (error) throw error;

      // Create a download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = filePath.split('/').pop() || 'anonymized-note.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

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
                        {note.anonymized_file_path && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownload(note.anonymized_file_path!)}
                            className="flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No recent recordings found</p>
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