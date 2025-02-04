import { useState } from "react";
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

  const handleTranscriptionComplete = (text: string, speakers: Speaker[], segments: Segment[]) => {
    setTranscript(text);
    onTranscriptionComplete(text, speakers, segments);
  };

  const handleProcedureCodes = (codes: string[]) => {
    setProcedureCodes(codes);
  };

  const processAudio = async (audioBlob: Blob) => {
    const data = await processAudioBlob(
      audioBlob,
      handleTranscriptionComplete,
      onSoapNoteGenerated,
      onProcessingStateChange
    );

    if (data) {
      handleTranscriptionComplete(data.text, data.speakers, data.segments);
    }
  };

  return (
    <>
      <ProcedureCodeValidator onValidate={handleProcedureCodes} />
      {transcript && (
        <SoapNoteGenerator
          transcript={transcript}
          procedureCodes={procedureCodes}
          onSoapNoteGenerated={onSoapNoteGenerated}
        />
      )}
    </>
  );
};

export default TranscriptionProcessor;