import { generateSoapNote } from "@/services/openaiService";

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
  } catch (error) {
    console.error("Error generating SOAP note:", error);
  }
};

export default SoapNoteGenerator;