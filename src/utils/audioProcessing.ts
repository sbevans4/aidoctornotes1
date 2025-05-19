
import { supabase } from "@/integrations/supabase/client";

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
  onProcessingStateChange?: (isProcessing: boolean) => void
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
    
    // Call the transcription API
    const { data: transcriptionData, error: transcriptionError } = await supabase.functions.invoke("transcribe-audio", {
      body: { audio: audioBase64 },
      method: "POST",
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
    
    // Generate SOAP note
    const { data: soapData, error: soapError } = await supabase.functions.invoke("generate-soap", {
      body: { transcription, noteId: id },
      method: "POST",
    });
    
    if (soapError) {
      console.error("Error generating SOAP note:", soapError);
      throw soapError;
    }
    
    if (soapData?.soap_note && onSoapNoteGenerated) {
      onSoapNoteGenerated(soapData.soap_note);
    }
    
    if (onProcessingStateChange) {
      onProcessingStateChange(false);
    }
    
    return {
      text: transcription,
      speakers: speakers,
      segments: segments,
    };
  } catch (error) {
    console.error("Error processing audio:", error);
    if (onProcessingStateChange) {
      onProcessingStateChange(false);
    }
    throw error;
  }
};
