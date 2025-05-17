
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import TranscriptionProcessor from "./TranscriptionProcessor";
import RecordingControls from "./RecordingControls";
import TranscriptDisplay from "./TranscriptDisplay";
import SoapNoteDisplay from "./SoapNoteDisplay";
import { templateOptions } from "./advanced-documentation/TemplateSelector";
import TemplateSelector from "./advanced-documentation/TemplateSelector";
import { Skeleton } from "@/components/ui/skeleton";
import RecordingProvider from "./recording/RecordingProvider";
import { processAudioBlob } from "@/utils/audioProcessing";

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

const VoiceRecorder = () => {
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
  
  const handleTranscriptionComplete = (
    transcript: string,
    speakers: Speaker[],
    segments: Segment[]
  ) => {
    setTranscript(transcript);
    setSpeakers(speakers);
    setSegments(segments);
    toast({
      title: "Transcription complete",
      description: "Your audio has been successfully transcribed.",
    });
  };
  
  const handleSoapNoteGenerated = (soapNote: SoapNote) => {
    setSoapNote(soapNote);
    toast({
      title: "SOAP note generated",
      description: "Your clinical note is ready for review.",
    });
    setIsProcessing(false);
  };
  
  const handleProcessingStateChange = (isProcessing: boolean) => {
    setIsProcessing(isProcessing);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };
  
  const handleAudioProcessed = async (audioBlob: Blob) => {
    setIsProcessing(true);
    toast({
      title: "Processing audio",
      description: "This might take a moment...",
    });
    
    try {
      // Reset state for new processing
      setTranscript("");
      setSoapNote({
        subjective: "",
        objective: "",
        assessment: "",
        plan: "",
      });
      setSpeakers([]);
      setSegments([]);
      
      await processAudioBlob(
        audioBlob, 
        handleTranscriptionComplete, 
        handleSoapNoteGenerated,
        handleProcessingStateChange
      );
    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        title: "Processing Error",
        description: "Failed to process the audio. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <TemplateSelector 
        selectedTemplateId={selectedTemplateId}
        onChange={handleTemplateChange}
      />
      
      <Card className="p-6">
        <RecordingProvider onAudioProcessed={handleAudioProcessed}>
          {(recordingContext) => (
            <RecordingControls
              isRecording={recordingContext.isRecording}
              isPaused={recordingContext.isPaused}
              isProcessing={isProcessing}
              onStartRecording={recordingContext.startRecording}
              onStopRecording={recordingContext.stopRecording}
              onPauseRecording={recordingContext.pauseRecording}
              onResumeRecording={recordingContext.resumeRecording}
            />
          )}
        </RecordingProvider>
        
        {isProcessing && (
          <div className="text-center py-8">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-24 w-full mx-auto" />
          </div>
        )}
        
        {transcript && !isProcessing && (
          <TranscriptDisplay
            transcript={transcript}
            speakers={speakers}
            segments={segments}
          />
        )}
        
        {soapNote.subjective && !isProcessing && (
          <SoapNoteDisplay soapNote={soapNote} />
        )}
        
        <TranscriptionProcessor
          onTranscriptionComplete={handleTranscriptionComplete}
          onSoapNoteGenerated={handleSoapNoteGenerated}
          onProcessingStateChange={handleProcessingStateChange}
        />
      </Card>
    </div>
  );
};

export default VoiceRecorder;
