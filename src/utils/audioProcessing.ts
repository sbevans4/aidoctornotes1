
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
  text: string;
  speakers: Speaker[];
  segments: Segment[];
}

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export const processAudioBlob = async (
  audioBlob: Blob,
  onTranscriptionComplete?: (text: string, speakers: Speaker[], segments: Segment[]) => void,
  onSoapNoteGenerated?: (soapNote: SoapNote) => void,
  onProcessingStateChange?: (isProcessing: boolean) => void,
  templateId: string = "general"
): Promise<TranscriptionResult | undefined> => {
  try {
    // Convert audio blob to base64
    const reader = new FileReader();
    const audioBase64Promise = new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error('Failed to convert audio to base64'));
        }
      };
      reader.onerror = () => reject(reader.error);
    });
    
    reader.readAsDataURL(audioBlob);
    const audioBase64 = await audioBase64Promise;
    
    if (onProcessingStateChange) {
      onProcessingStateChange(true);
    }
    
    toast({
      title: "Transcribing Audio",
      description: "Converting your recording to text...",
    });
    
    // Call the transcription API
    const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke("transcribe-audio", {
      body: { audio: audioBase64 },
    });
    
    if (transcriptionError) {
      console.error("Error transcribing audio:", transcriptionError);
      throw transcriptionError;
    }
    
    if (!transcriptionData) {
      throw new Error("No transcription data returned");
    }
    
    const { id, transcription, speakers, segments } = transcriptionData;
    
    if (onTranscriptionComplete) {
      onTranscriptionComplete(transcription, speakers, segments);
    }
    
    toast({
      title: "Transcription Complete", 
      description: "Your audio has been successfully transcribed."
    });
    
    return {
      text: transcription,
      speakers: speakers || [],
      segments: segments || [],
    };
  } catch (error) {
    console.error("Error processing audio:", error);
    toast({
      title: "Transcription Error",
      description: error.message || "An error occurred during transcription",
      variant: "destructive",
    });
    
    if (onProcessingStateChange) {
      onProcessingStateChange(false);
    }
    throw error;
  }
};
