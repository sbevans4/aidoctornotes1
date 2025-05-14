
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
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
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
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsPaused(false);
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Access Error",
        description: "Failed to access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const handleStopRecording = async () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      
      // Save recording metadata to Supabase
      if (user) {
        try {
          await supabase.from("recordings").insert({
            user_id: user.id,
            title: `Recording ${new Date().toLocaleString()}`,
            duration: Math.floor(elapsedTime) // In seconds
          });
        } catch (error) {
          console.error("Error saving recording metadata:", error);
        }
      }

      // Process audio
      processAudio();
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
  
  const processAudio = async () => {
    setIsProcessing(true);
    toast({
      title: "Processing audio",
      description: "This might take a moment...",
    });
    
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      
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
      
      // TranscriptionProcessor will handle the actual processing
      // We're setting up the UI for feedback
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

  // Track elapsed time
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRecording && !isPaused) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording) {
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, isPaused]);
  
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
