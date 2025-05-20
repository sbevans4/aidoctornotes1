
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

export const processAudioBlob = async (
  audioBlob: Blob,
  onTranscriptionComplete?: (text: string, speakers: Speaker[], segments: Segment[]) => void,
  onProcessingStateChange?: (isProcessing: boolean) => void
): Promise<TranscriptionResult | undefined> => {
  try {
    if (onProcessingStateChange) {
      onProcessingStateChange(true);
    }
    
    // Prepare form data for the API call
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    
    console.log("Sending audio for transcription...");
    
    // Call the transcription API
    const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke("transcribe-audio", {
      body: formData,
    });
    
    if (transcriptionError) {
      console.error("Error transcribing audio:", transcriptionError);
      throw transcriptionError;
    }
    
    if (!transcriptionData) {
      throw new Error("No transcription data returned");
    }
    
    console.log("Transcription completed:", transcriptionData);
    
    const { transcription, speakers, segments } = transcriptionData;
    
    if (onTranscriptionComplete && transcription) {
      onTranscriptionComplete(transcription, speakers || [], segments || []);
    }
    
    return {
      text: transcription,
      speakers: speakers || [],
      segments: segments || [],
    };
  } catch (error) {
    console.error("Error processing audio:", error);
    if (onProcessingStateChange) {
      onProcessingStateChange(false);
    }
    throw error;
  }
};
