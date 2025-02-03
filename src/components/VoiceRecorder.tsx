import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { generateSoapNote } from "@/services/openaiService";
import TranscriptDisplay from "./TranscriptDisplay";
import SoapNoteDisplay from "./SoapNoteDisplay";
import { supabase } from "@/integrations/supabase/client";

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
  const [recordingId, setRecordingId] = useState<string | null>(null);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [segments, setSegments] = useState<Segment[]>([]);
  const [soapNote, setSoapNote] = useState<SoapNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const { toast } = useToast();

  const processRecording = async () => {
    try {
      setIsProcessing(true);
      const audioBlob = await stopRecording();
      
      toast({
        title: "Processing",
        description: "Transcribing conversation...",
      });

      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        if (!base64Audio) {
          throw new Error('Failed to convert audio to base64');
        }

        const response = await fetch('/functions/transcribe-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': (await supabase.auth.getUser()).data.user?.id || '',
          },
          body: JSON.stringify({ audio: base64Audio }),
        });

        if (!response.ok) {
          throw new Error('Transcription failed');
        }

        const data = await response.json();
        setTranscript(data.text);
        setRecordingId(data.recordingId);
        setSpeakers(data.speakers);
        setSegments(data.segments);

        toast({
          title: "Generating SOAP Note",
          description: "Analyzing conversation...",
        });

        const codes = Array.from(document.querySelectorAll('input[placeholder^="Code"]'))
          .map((input) => (input as HTMLInputElement).value)
          .filter(Boolean);

        const generatedNote = await generateSoapNote(data.text, codes);
        setSoapNote(generatedNote);

        toast({
          title: "Complete",
          description: "SOAP note has been generated.",
        });
      };
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-center">
          {!isProcessing && (
            <Button
              onClick={isRecording ? processRecording : startRecording}
              className={`w-16 h-16 rounded-full ${
                isRecording 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-medical-primary hover:bg-medical-secondary"
              }`}
            >
              {isRecording ? (
                <Square className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          )}
          
          {isProcessing && (
            <div className="flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Processing...</span>
            </div>
          )}
        </div>

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