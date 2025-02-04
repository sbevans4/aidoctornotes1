import { generateSoapNote } from "@/services/openaiService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/integrations/supabase/types";

interface SoapNoteGeneratorProps {
  transcript: string;
  procedureCodes: string[];
  onSoapNoteGenerated: (soapNote: any) => void;
}

const SoapNoteGenerator = async ({
  transcript,
  procedureCodes,
  onSoapNoteGenerated,
}: SoapNoteGeneratorProps) => {
  try {
    const generatedNote = await generateSoapNote(transcript, procedureCodes);
    
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("User not authenticated");
    }

    // Save the note to the database
    const { data: noteData, error: saveError } = await supabase
      .from('clinical_notes')
      .insert({
        content: generatedNote as Json,
        suggested_codes: procedureCodes as Json,
        status: 'completed',
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