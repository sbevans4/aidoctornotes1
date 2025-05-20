
import { useTranscription } from "@/contexts/TranscriptionContext";
import { toast } from "@/hooks/use-toast";
import SoapNoteGenerator from "../SoapNoteGenerator";

interface TranscriptionHandlerProps {
  onProcedureCodesValidated?: (codes: string[]) => void;
}

const TranscriptionHandler = ({ onProcedureCodesValidated }: TranscriptionHandlerProps) => {
  const {
    transcript,
    selectedTemplateId,
    procedureCodes,
    setSoapNote,
    setIsProcessing,
  } = useTranscription();

  const handleSoapNoteGenerated = (soapNote: any) => {
    setSoapNote(soapNote);
    toast({
      title: "SOAP note generated",
      description: "Your clinical note is ready for review.",
    });
    setIsProcessing(false);
  };

  const generateSoapNote = async (transcriptText: string, codes: string[]) => {
    if (!transcriptText || codes.length === 0) return;
    
    setIsProcessing(true);
    toast({
      title: "Generating SOAP note",
      description: "Please wait while we analyze the transcription...",
    });
    
    try {
      await SoapNoteGenerator({
        transcript: transcriptText,
        procedureCodes: codes,
        templateId: selectedTemplateId,
        onSoapNoteGenerated: handleSoapNoteGenerated,
      });
    } catch (error) {
      console.error("Error generating SOAP note:", error);
      toast({
        title: "Error",
        description: "Failed to generate the SOAP note. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  // Effect to generate SOAP note when we have both transcript and codes
  if (transcript && procedureCodes.length > 0) {
    generateSoapNote(transcript, procedureCodes);
  }

  return null; // This is a logic component, no UI
};

export default TranscriptionHandler;
