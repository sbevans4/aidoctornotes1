import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TranscriptionResult {
  text: string;
  speakers: Array<{ id: string; name: string }>;
  segments: Array<{ start: number; end: number; text: string; speaker?: string }>;
}

export const processAudioBlob = async (
  audioBlob: Blob,
  onTranscriptionComplete: (text: string, speakers: any[], segments: any[]) => void,
  onSoapNoteGenerated: (soapNote: any) => void,
  onProcessingStateChange: (isProcessing: boolean) => void
): Promise<TranscriptionResult | undefined> => {
  try {
    onProcessingStateChange(true);
    
    toast({
      title: "Processing",
      description: "Transcribing conversation...",
    });

    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    
    return new Promise((resolve, reject) => {
      reader.onloadend = async () => {
        try {
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
          resolve(data as TranscriptionResult);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read audio file'));
    });
  } catch (error) {
    toast({
      title: "Error",
      description: error instanceof Error ? error.message : "An error occurred",
      variant: "destructive",
    });
    return undefined;
  } finally {
    onProcessingStateChange(false);
  }
};