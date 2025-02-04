import { useState, useEffect } from "react";
import { processAudioBlob } from "@/utils/audioProcessing";
import ProcedureCodeValidator from "./ProcedureCodeValidator";
import SoapNoteGenerator from "./SoapNoteGenerator";

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
}

const TranscriptionProcessor = ({
  onTranscriptionComplete,
  onSoapNoteGenerated,
  onProcessingStateChange,
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
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const data = await processAudioBlob(
        audioBlob,
        handleTranscriptionComplete,
        onSoapNoteGenerated,
        onProcessingStateChange
      );
      
      if (data && 'text' in data) {
        handleTranscriptionComplete(data.text, data.speakers, data.segments);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
    }
  };

  useEffect(() => {
    if (transcript && procedureCodes.length > 0 && !isGeneratingSoapNote) {
      setIsGeneratingSoapNote(true);
      const generateNote = async () => {
        await SoapNoteGenerator({
          transcript,
          procedureCodes,
          onSoapNoteGenerated,
        });
        setIsGeneratingSoapNote(false);
      };
      generateNote();
    }
  }, [transcript, procedureCodes, onSoapNoteGenerated]);

  return (
    <>
      <ProcedureCodeValidator onValidate={handleProcedureCodes} />
    </>
  );
};

export default TranscriptionProcessor;