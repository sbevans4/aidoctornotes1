
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SoapNote } from "@/hooks/useSoapNoteGeneration";
import { templateOptions } from "@/components/advanced-documentation/TemplateSelector";

// Local cache for procedure code suggestions based on transcript content
const suggestionCache = new Map<string, string[]>();

// Helper to get a transcript signature (simple hash for caching)
const getTranscriptSignature = (text: string): string => {
  return text.slice(0, 100).replace(/\s+/g, '');
};

// Generate a SOAP note using the DeepSeek API
export async function generateSoapNote(
  transcript: string, 
  procedureCodes: string[],
  templateId: string = "general"
): Promise<SoapNote> {
  try {
    const transcriptSignature = getTranscriptSignature(transcript);
    
    console.log("Generating SOAP note with parameters:", {
      transcription: transcript.substring(0, 100) + "...", // Log just a preview
      procedureCodes,
      templateId,
      transcriptSignature
    });

    // Check if we already have cached suggestions for this transcript
    if (!suggestionCache.has(transcriptSignature)) {
      console.log("No cache hit for this transcript signature");
    }

    // Call the edge function which already has access to the DeepSeek API key
    const { data, error } = await supabase.functions.invoke('generate-soap-deepseek', {
      body: { 
        transcription: transcript, 
        procedureCodes,
        templateId 
      }
    });
    
    if (error) {
      console.error("DeepSeek function error:", error);
      throw error;
    }
    
    if (!data?.soap_note) {
      console.error("No SOAP note in response:", data);
      throw new Error('Failed to generate SOAP note with DeepSeek');
    }

    // If we got suggested codes, cache them for future use
    if (data.suggested_codes) {
      console.log("Caching suggested codes:", data.suggested_codes);
      suggestionCache.set(transcriptSignature, data.suggested_codes);
    }

    console.log("SOAP note generated successfully");
    
    return data.soap_note;
  } catch (error: any) {
    console.error('DeepSeek API error:', error);
    toast({
      title: "Error Generating SOAP Note",
      description: error.message || "An error occurred while generating the SOAP note",
      variant: "destructive",
    });
    throw error;
  }
}

// New function to get procedure code suggestions from transcript
export async function getProcedureCodeSuggestions(
  transcript: string
): Promise<string[]> {
  // First check our local cache
  const transcriptSignature = getTranscriptSignature(transcript);
  if (suggestionCache.has(transcriptSignature)) {
    console.log("Using cached procedure code suggestions");
    return suggestionCache.get(transcriptSignature) || [];
  }
  
  try {
    console.log("Requesting procedure code suggestions for transcript");
    
    // Call the edge function to get suggestions
    const { data, error } = await supabase.functions.invoke('suggest-procedure-codes', {
      body: { transcription: transcript }
    });
    
    if (error) {
      console.error("Suggestion function error:", error);
      throw error;
    }
    
    if (!data?.codes || !Array.isArray(data.codes)) {
      console.warn("No code suggestions returned:", data);
      return [];
    }
    
    // Cache the suggestions
    suggestionCache.set(transcriptSignature, data.codes);
    
    return data.codes;
  } catch (error: any) {
    console.error('Code suggestion error:', error);
    // Don't show toast here as this is a background operation
    return [];
  }
}
