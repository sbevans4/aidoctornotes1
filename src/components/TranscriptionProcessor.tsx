
import { useState, useEffect } from "react";
import { processAudioBlob } from "@/utils/audioProcessing";
import ProcedureCodeValidator from "./ProcedureCodeValidator";
import SoapNoteGenerator from "./SoapNoteGenerator";
import { toast } from "@/hooks/use-toast";

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

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface TranscriptionProcessorProps {
  onTranscriptionComplete: (transcript: string, speakers: Speaker[], segments: Segment[]) => void;
  onSoapNoteGenerated: (soapNote: SoapNote) => void;
  onProcessingStateChange: (isProcessing: boolean) => void;
  selectedTemplateId?: string;
}

const TranscriptionProcessor = ({
  onTranscriptionComplete,
  onSoapNoteGenerated,
  onProcessingStateChange,
  selectedTemplateId = "general",
}: TranscriptionProcessorProps) => {
  const [transcript, setTranscript] = useState<string>("");
  const [procedureCodes, setProcedureCodes] = useState<string[]>([]);
  const [isGeneratingSoapNote, setIsGeneratingSoapNote] = useState(false);

  const handleTranscriptionComplete = (text: string, speakers: Speaker[], segments: Segment[]) => {
    setTranscript(text);
    onTranscriptionComplete(text, speakers, segments);
  };

  const handleProcedureCodes = (codes: string[]) => {
    setProcedureCodes(codes);
    toast({
      title: "Procedure Codes Updated",
      description: `${codes.length} procedure codes successfully validated`,
    });
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      onProcessingStateChange(true);
      
      // Update the call to match the function signature in audioProcessing.ts
      const result = await processAudioBlob(
        audioBlob,
        handleTranscriptionComplete,
        onProcessingStateChange
      );
      
      if (result) {
        handleTranscriptionComplete(result.text, result.speakers, result.segments);
      }
      
      onProcessingStateChange(false);
    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        title: "Processing Error",
        description: "An error occurred while processing the audio",
        variant: "destructive",
      });
      onProcessingStateChange(false);
    }
  };

  useEffect(() => {
    if (transcript && procedureCodes.length > 0 && !isGeneratingSoapNote) {
      setIsGeneratingSoapNote(true);
      const generateNote = async () => {
        try {
          await SoapNoteGenerator({
            transcript,
            procedureCodes,
            templateId: selectedTemplateId,
            onSoapNoteGenerated,
          });
        } catch (error) {
          console.error("Error generating SOAP note:", error);
          toast({
            title: "SOAP Note Generation Failed",
            description: "Unable to generate the SOAP note. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsGeneratingSoapNote(false);
        }
      };
      generateNote();
    }
  }, [transcript, procedureCodes, onSoapNoteGenerated, selectedTemplateId]);

  return (
    <>
      <ProcedureCodeValidator onValidate={handleProcedureCodes} />
    </>
  );
};

export default TranscriptionProcessor;
