
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import TranscriptDisplay from "./TranscriptDisplay";
import SoapNoteDisplay from "./SoapNoteDisplay";
import RecordingControls from "./RecordingControls";
import TranscriptionProcessor from "./TranscriptionProcessor";

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

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

const VoiceRecorder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [soapNote, setSoapNote] = useState<SoapNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();

  const handleStopRecording = async () => {
    const audioBlob = await stopRecording();
    return audioBlob;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-4 sm:p-6 overflow-hidden">
      <div className="space-y-4 sm:space-y-6">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3">
          <RecordingControls
            isRecording={isRecording}
            isProcessing={isProcessing}
            onStartRecording={startRecording}
            onStopRecording={handleStopRecording}
          />
        </div>
        
        <TranscriptionProcessor
          onTranscriptionComplete={(text, spkrs, segs) => {
            setTranscript(text);
            setSpeakers(spkrs);
            setSegments(segs);
          }}
          onSoapNoteGenerated={setSoapNote}
          onProcessingStateChange={setIsProcessing}
        />

        <div className="space-y-4 sm:space-y-6">
          <TranscriptDisplay 
            transcript={transcript} 
            speakers={speakers}
            segments={segments}
          />
          <SoapNoteDisplay soapNote={soapNote} />
        </div>
      </div>
    </Card>
  );
};

export default VoiceRecorder;
