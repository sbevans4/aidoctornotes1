
import { createContext, useContext, useState, ReactNode } from "react";

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

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

interface TranscriptionContextType {
  transcript: string;
  soapNote: SoapNote;
  speakers: Speaker[];
  segments: Segment[];
  isProcessing: boolean;
  selectedTemplateId: string;
  procedureCodes: string[];
  setTranscript: (transcript: string) => void;
  setSoapNote: (soapNote: SoapNote) => void;
  setSpeakers: (speakers: Speaker[]) => void;
  setSegments: (segments: Segment[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
  setSelectedTemplateId: (templateId: string) => void;
  setProcedureCodes: (codes: string[]) => void;
}

const TranscriptionContext = createContext<TranscriptionContextType | undefined>(undefined);

export const useTranscription = () => {
  const context = useContext(TranscriptionContext);
  if (context === undefined) {
    throw new Error("useTranscription must be used within a TranscriptionProvider");
  }
  return context;
};

interface TranscriptionProviderProps {
  children: ReactNode;
}

export const TranscriptionProvider = ({ children }: TranscriptionProviderProps) => {
  const [transcript, setTranscript] = useState("");
  const [soapNote, setSoapNote] = useState<SoapNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState("general");
  const [procedureCodes, setProcedureCodes] = useState<string[]>([]);

  return (
    <TranscriptionContext.Provider
      value={{
        transcript,
        soapNote,
        speakers,
        segments,
        isProcessing,
        selectedTemplateId,
        procedureCodes,
        setTranscript,
        setSoapNote,
        setSpeakers,
        setSegments,
        setIsProcessing,
        setSelectedTemplateId,
        setProcedureCodes,
      }}
    >
      {children}
    </TranscriptionContext.Provider>
  );
};
