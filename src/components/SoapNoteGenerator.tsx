
import { generateSoapNote } from "@/services/deepseekService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

interface SoapNoteGeneratorProps {
  transcript: string;
  procedureCodes: string[];
  templateId?: string;
  onSoapNoteGenerated: (soapNote: any) => void;
}

const SoapNoteGenerator = async ({
  transcript,
  procedureCodes,
  templateId = "general",
  onSoapNoteGenerated,
}: SoapNoteGeneratorProps) => {
  try {
    const generatedNote = await generateSoapNote(transcript, procedureCodes, templateId);
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Save the note to the database - cast to Json type to fix the TypeScript error
    const { data: noteData, error: saveError } = await supabase
      .from('clinical_notes')
      .insert({
        content: generatedNote as unknown as Json,
        suggested_codes: procedureCodes as unknown as Json,
        status: 'completed',
        template_id: templateId,
        user_id: user.id
      })
      .select()
      .single();

    if (saveError) {
      console.error("Error saving clinical note:", saveError);
      toast({
        title: "Error",
        description: "Failed to save the note. Please try again.",
        variant: "destructive",
      });
      return;
    }

    onSoapNoteGenerated(generatedNote);
    
    toast({
      title: "Note Generated",
      description: "The SOAP note has been generated and saved.",
    });
  } catch (error) {
    console.error("Error generating SOAP note:", error);
    toast({
      title: "Error",
      description: "Failed to generate the note. Please try again.",
      variant: "destructive",
    });
  }
};

export default SoapNoteGenerator;
