import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateSoapNote } from "@/services/openaiService";

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

interface TranscriptionProcessorProps {
  onTranscriptionComplete: (transcript: string, speakers: Speaker[], segments: Segment[]) => void;
  onSoapNoteGenerated: (soapNote: SoapNote) => void;
  onProcessingStateChange: (isProcessing: boolean) => void;
}

const TranscriptionProcessor = ({
  onTranscriptionComplete,
  onSoapNoteGenerated,
  onProcessingStateChange,
}: TranscriptionProcessorProps) => {
  const { toast } = useToast();
  const [recordingId, setRecordingId] = useState<string | null>(null);

  const processAudioBlob = async (audioBlob: Blob) => {
    try {
      onProcessingStateChange(true);
      
      toast({
        title: "Processing",
        description: "Transcribing conversation...",
      });

      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio to base64');
        }

        const response = await fetch('/functions/transcribe-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': (await supabase.auth.getUser()).data.user?.id || '',
          },
          body: JSON.stringify({ audio: base64Audio }),
        });

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();
        setRecordingId(data.recordingId);
        onTranscriptionComplete(data.text, data.speakers, data.segments);

        const codes = Array.from(document.querySelectorAll('input[placeholder^="Code"]'))
          .map((input) => (input as HTMLInputElement).value)
          .filter(Boolean);

        if (codes.length === 0) {
          toast({
            title: "Warning",
            description: "No procedure codes entered. This may affect documentation compliance.",
            variant: "destructive",
          });
        }

        const generatedNote = await generateSoapNote(data.text, codes);
        onSoapNoteGenerated(generatedNote);
      };
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      onProcessingStateChange(false);
    }
  };

  return null; // This is a logic-only component
};

export default TranscriptionProcessor;