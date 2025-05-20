
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SoapNote } from "@/hooks/useSoapNoteGeneration";
import { templateOptions } from "@/components/advanced-documentation/TemplateSelector";

// Generate a SOAP note using the DeepSeek API
export async function generateSoapNote(
  transcript: string, 
  procedureCodes: string[],
  templateId: string = "general"
): Promise<SoapNote> {
  try {
    console.log("Generating SOAP note with parameters:", {
      transcription: transcript.substring(0, 100) + "...", // Log just a preview
      procedureCodes,
      templateId
    });

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

    console.log("SOAP note generated successfully");
    
    return data.soap_note;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    toast({
      title: "Error Generating SOAP Note",
      description: error.message || "An error occurred while generating the SOAP note",
      variant: "destructive",
    });
    throw error;
  }
}
