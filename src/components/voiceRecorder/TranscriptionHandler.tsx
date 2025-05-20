
import { useEffect } from "react";
import { useTranscription } from "@/contexts/TranscriptionContext";
import { toast } from "@/hooks/use-toast";
import { generateSoapNote } from "@/services/deepseekService";

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

  // Effect to generate SOAP note when we have both transcript and codes
  useEffect(() => {
    const generateSoapNoteFromTranscript = async () => {
      if (!transcript || procedureCodes.length === 0) return;
      
      setIsProcessing(true);
      toast({
        title: "Generating SOAP note",
        description: "Please wait while we analyze the transcription...",
      });
      
      try {
        const generatedNote = await generateSoapNote(transcript, procedureCodes, selectedTemplateId);
        setSoapNote(generatedNote);
        
        toast({
          title: "SOAP note generated",
          description: "Your clinical note is ready for review.",
        });
      } catch (error) {
        console.error("Error generating SOAP note:", error);
        toast({
          title: "Error",
          description: "Failed to generate the SOAP note. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };

    if (transcript && procedureCodes.length > 0) {
      generateSoapNoteFromTranscript();
    }
  }, [transcript, procedureCodes, selectedTemplateId, setSoapNote, setIsProcessing]);

  return null; // This is a logic component, no UI
};

export default TranscriptionHandler;
