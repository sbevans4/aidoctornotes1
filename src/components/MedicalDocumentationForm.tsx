
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AudioRecorder from "@/components/AudioRecorder";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import SoapNoteDisplay from "@/components/SoapNoteDisplay";
import { Button } from "@/components/ui/button";
import { Loader, RefreshCw, AlertCircle } from "lucide-react";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { OfflineNotification } from "@/components/ui/offline-notification";

interface Speaker {
  id: string;
  name: string;
}

interface Segment {
  start: number;
  end: number;
  text: string;
  speaker?: string;
}

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const MedicalDocumentationForm = () => {
  const { isOnline } = useNetworkStatus();
  const { user } = useAuth();
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);
  const [soapError, setSoapError] = useState<string | null>(null);
  const [procedureCodes, setProcedureCodes] = useState<string[]>([]);

  const handleRecordingComplete = async (blob: Blob) => {
    setAudioBlob(blob);
    await handleTranscribe(blob);
  };

  const handleTranscribe = async (blob: Blob) => {
    if (!blob) return;
    
    setIsTranscribing(true);
    setTranscriptionError(null);
    setTranscript(null);
    setSpeakers([]);
    setSegments([]);
    setNoteId(null);
    setSoapNote(null);
    
    try {
      // Create form data for the API call
      const formData = new FormData();
      formData.append('audio', blob, 'recording.webm');
      
      // Get Supabase auth token for the API call
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('You must be logged in to transcribe audio');
      }
      
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: formData,
      });
      
      if (error) throw error;
      
      if (data && data.transcription) {
        setTranscript(data.transcription);
        if (data.speakers) setSpeakers(data.speakers);
        if (data.segments) setSegments(data.segments);
        if (data.noteId) setNoteId(data.noteId);
        
        toast({
          title: "Transcription Complete",
          description: "Your audio has been transcribed successfully.",
        });
        
        // Generate SOAP note automatically
        await handleGenerateSoapNote(data.transcription, data.noteId);
      } else {
        throw new Error('No transcription returned from the service');
      }
    } catch (error) {
      setTranscriptionError(error.message || 'Failed to transcribe audio');
      toast({
        title: "Transcription Failed",
        description: error.message || "There was an error transcribing your audio.",
        variant: "destructive",
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleGenerateSoapNote = async (transcriptText: string, noteId: string | null = null) => {
    if (!transcriptText) {
      setTranscript(null);
      return;
    }
    
    setIsGeneratingSoap(true);
    setSoapError(null);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-soap', {
        body: { 
          transcription: transcriptText,
          noteId: noteId,
          procedureCodes: procedureCodes,
        },
      });
      
      if (error) throw error;
      
      if (data && data.soap_note) {
        setSoapNote(data.soap_note);
        toast({
          title: "SOAP Note Generated",
          description: "Your medical documentation is ready.",
        });
      } else {
        throw new Error('No SOAP note returned from the service');
      }
    } catch (error) {
      setSoapError(error.message || 'Failed to generate SOAP note');
      toast({
        title: "SOAP Note Generation Failed",
        description: error.message || "There was an error creating your documentation.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSoap(false);
    }
  };

  const handleSaveSoapNote = async (note: SoapNote) => {
    if (!noteId) return;
    
    try {
      const { error } = await supabase
        .from('notes')
        .update({
          soap_note: note,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId);
      
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Save Error",
        description: error.message || "Failed to save your note.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleEmailSoapNote = async (note: SoapNote) => {
    try {
      // This would call an edge function to send email
      // For now, just show a toast
      toast({
        title: "Email Feature",
        description: "Email functionality will be implemented in a future update.",
      });
    } catch (error) {
      toast({
        title: "Email Error",
        description: error.message || "Failed to send email.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleReset = () => {
    setAudioBlob(null);
    setTranscript(null);
    setSpeakers([]);
    setSegments([]);
    setNoteId(null);
    setSoapNote(null);
    setTranscriptionError(null);
    setSoapError(null);
  };

  if (!isOnline) {
    return <OfflineNotification />;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="grid gap-6 md:gap-8">
        {/* Step 1: Record Audio */}
        <div className={transcript ? "opacity-50" : ""}>
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete} 
            className="w-full"
          />
        </div>
        
        {/* Step 2: Transcription */}
        {(isTranscribing || transcript || transcriptionError) && (
          <TranscriptDisplay 
            transcript={transcript || undefined}
            speakers={speakers}
            segments={segments}
            isLoading={isTranscribing}
            error={transcriptionError || undefined}
          />
        )}
        
        {/* Step 3: SOAP Note */}
        {(isGeneratingSoap || soapNote || soapError) && (
          <SoapNoteDisplay 
            soapNote={soapNote || undefined}
            isLoading={isGeneratingSoap}
            error={soapError || undefined}
            onSave={handleSaveSoapNote}
            onEmail={handleEmailSoapNote}
          />
        )}
        
        {/* Reset Button */}
        {(transcript || soapNote) && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Start New Documentation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalDocumentationForm;
