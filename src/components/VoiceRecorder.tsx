
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import TranscriptionProcessor from "./TranscriptionProcessor";
import RecordingControls from "./RecordingControls";
import TranscriptDisplay from "./TranscriptDisplay";
import SoapNoteDisplay from "./SoapNoteDisplay";
import { templateOptions } from "./advanced-documentation/TemplateSelector";
import TemplateSelector from "./advanced-documentation/TemplateSelector";

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
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
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
  
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        audioChunksRef.current = [];
        
        // Process the audio with the selected template
        setIsProcessing(true);
        try {
          // Here you would pass the selected template to the processing function
          // For now, we're just showing the UI
        } catch (error) {
          console.error("Error processing audio:", error);
          toast({
            title: "Processing Error",
            description: "Failed to process the audio. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsProcessing(false);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Access Error",
        description: "Failed to access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  const handlePauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  };
  
  const handleResumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  };
  
  const handleTranscriptionComplete = (
    transcript: string,
    speakers: Speaker[],
    segments: Segment[]
  ) => {
    setTranscript(transcript);
    setSpeakers(speakers);
    setSegments(segments);
  };
  
  const handleSoapNoteGenerated = (soapNote: SoapNote) => {
    setSoapNote(soapNote);
  };
  
  const handleProcessingStateChange = (isProcessing: boolean) => {
    setIsProcessing(isProcessing);
  };

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };
  
  return (
    <div className="space-y-6">
      <TemplateSelector 
        selectedTemplateId={selectedTemplateId}
        onChange={handleTemplateChange}
      />
      
      <Card className="p-6">
        <RecordingControls
          isRecording={isRecording}
          isPaused={isPaused}
          isProcessing={isProcessing}
          onStartRecording={handleStartRecording}
          onStopRecording={handleStopRecording}
          onPauseRecording={handlePauseRecording}
          onResumeRecording={handleResumeRecording}
        />
        
        {transcript && (
          <TranscriptDisplay
            text={transcript}
            speakers={speakers}
            segments={segments}
          />
        )}
        
        <SoapNoteDisplay soapNote={soapNote} />
        
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
