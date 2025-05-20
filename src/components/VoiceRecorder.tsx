
import { useState } from "react";
import { Card } from "@/components/ui/card";
import TemplateSelector from "./advanced-documentation/TemplateSelector";
import { TranscriptionProvider } from "@/contexts/TranscriptionContext";
import RecordingArea from "./voiceRecorder/RecordingArea";
import TranscriptArea from "./voiceRecorder/TranscriptArea";
import SoapNoteArea from "./voiceRecorder/SoapNoteArea";
import AudioProcessingHandler from "./voiceRecorder/AudioProcessingHandler";
import TranscriptionHandler from "./voiceRecorder/TranscriptionHandler";

const VoiceRecorder = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("general");

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleAudioProcessed = (blob: Blob) => {
    setAudioBlob(blob);
  };

  return (
    <TranscriptionProvider initialTemplate={selectedTemplateId}>
      <div className="space-y-6">
        <TemplateSelector 
          selectedTemplateId={selectedTemplateId}
          onChange={handleTemplateChange}
        />
        
        <Card className="p-6">
          <RecordingArea onAudioProcessed={handleAudioProcessed} />
          <TranscriptArea />
          <SoapNoteArea />
          
          {/* Logic components - no UI */}
          <AudioProcessingHandler audioBlob={audioBlob || undefined} />
          <TranscriptionHandler />
        </Card>
      </div>
    </TranscriptionProvider>
  );
};

export default VoiceRecorder;
