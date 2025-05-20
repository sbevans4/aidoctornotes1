
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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

interface TranscriptionResult {
  transcript: string | null;
  speakers: Speaker[];
  segments: Segment[];
  noteId: string | null;
  isTranscribing: boolean;
  transcriptionError: string | null;
}

export function useMedicalTranscription() {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [noteId, setNoteId] = useState<string | null>(null);
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null);

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

  const resetTranscription = () => {
    setAudioBlob(null);
    setTranscript(null);
    setSpeakers([]);
    setSegments([]);
    setNoteId(null);
    setTranscriptionError(null);
  };

  return {
    audioBlob,
    isTranscribing,
    transcript,
    speakers,
    segments,
    noteId,
    transcriptionError,
    handleRecordingComplete,
    handleTranscribe,
    resetTranscription
  };
}
