
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SoapNote } from "@/hooks/useSoapNoteGeneration";
import { generateSoapNotePrompt } from "@/utils/soapGeneration";
import { templateOptions } from "@/components/advanced-documentation/TemplateSelector";

// Generate a SOAP note using the DeepSeek API
export async function generateSoapNote(
  transcript: string, 
  procedureCodes: string[],
  templateId: string = "general"
): Promise<SoapNote> {
  try {
    // Instead of fetching from a secrets table, we'll call the edge function
    // which already has access to the DeepSeek API key
    const { data, error } = await supabase.functions.invoke('generate-soap-deepseek', {
      body: { 
        transcription: transcript, 
        procedureCodes,
        templateId 
      }
    });
    
    if (error) throw error;
    
    if (!data?.soap_note) {
      throw new Error('Failed to generate SOAP note with DeepSeek');
    }

    toast({
      title: "Documentation Complete",
      description: "SOAP note generated with all required elements for the specified procedures.",
    });

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
