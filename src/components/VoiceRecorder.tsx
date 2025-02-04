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
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <RecordingControls
          isRecording={isRecording}
          isProcessing={isProcessing}
          onStartRecording={startRecording}
          onStopRecording={handleStopRecording}
        />
        <TranscriptionProcessor
          onTranscriptionComplete={(text, spkrs, segs) => {
            setTranscript(text);
            setSpeakers(spkrs);
            setSegments(segs);
          }}
          onSoapNoteGenerated={setSoapNote}
          onProcessingStateChange={setIsProcessing}
        />
        <TranscriptDisplay 
          transcript={transcript} 
          speakers={speakers}
          segments={segments}
        />
        <SoapNoteDisplay soapNote={soapNote} />
      </div>
    </Card>
  );
};

export default VoiceRecorder;