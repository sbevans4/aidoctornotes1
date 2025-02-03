import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { transcribeAudio, generateSoapNote } from "@/services/openaiService";
import TranscriptDisplay from "./TranscriptDisplay";
import SoapNoteDisplay from "./SoapNoteDisplay";

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const VoiceRecorder = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
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

      const codes = Array.from(document.querySelectorAll('input[placeholder^="Code"]'))
        .map((input) => (input as HTMLInputElement).value)
        .filter(Boolean);

      const transcription = await transcribeAudio(audioBlob);
      setTranscript(transcription);

      toast({
        title: "Generating SOAP Note",
        description: "Analyzing conversation and codes...",
      });

      const generatedNote = await generateSoapNote(transcription, codes);
      setSoapNote(generatedNote);

      toast({
        title: "Complete",
        description: "SOAP note has been generated.",
      });
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

        <TranscriptDisplay transcript={transcript} />
        <SoapNoteDisplay soapNote={soapNote} />
      </div>
    </Card>
  );
};

export default VoiceRecorder;