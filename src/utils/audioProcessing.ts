
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

// Process audio in optimized chunks to prevent memory issues
async function processAudioChunks(audioBlob: Blob): Promise<ArrayBuffer> {
  // Convert blob to ArrayBuffer using FileReader with promise wrapper
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = reject;
    reader.readAsArrayBuffer(audioBlob);
  });
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
    
    console.log(`Processing audio blob: ${audioBlob.size} bytes, type: ${audioBlob.type}`);
    
    // Convert to ArrayBuffer for efficient processing
    const audioBuffer = await processAudioChunks(audioBlob);
    console.log(`Converted audio to ArrayBuffer: ${audioBuffer.byteLength} bytes`);
    
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
