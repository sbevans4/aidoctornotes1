import { generateSoapNote } from "@/services/openaiService";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

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
    onSoapNoteGenerated(generatedNote);

    // Get the latest clinical note for this transcript
    const { data: notes, error: notesError } = await supabase
      .from('clinical_notes')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (notesError) {
      console.error("Error fetching clinical note:", notesError);
      return;
    }

    if (notes && notes.length > 0) {
      // Trigger anonymization
      const response = await fetch('/functions/anonymize-note', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          noteId: notes[0].id,
          soapNote: generatedNote,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to anonymize note');
      }

      toast({
        title: "Note Anonymized",
        description: "The SOAP note has been anonymized and stored securely.",
      });
    }
  } catch (error) {
    console.error("Error generating or anonymizing SOAP note:", error);
    toast({
      title: "Error",
      description: "Failed to process the SOAP note. Please try again.",
      variant: "destructive",
    });
  }
};

export default SoapNoteGenerator;