import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { transcribeAudio, generateSoapNote } from "@/services/openaiService";

interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [soapNote, setSoapNote] = useState<SoapNote>({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      
      toast({
        title: "Recording Started",
        description: "Listening to conversation...",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorder.current || !isRecording) return;

    return new Promise<void>((resolve) => {
      if (!mediaRecorder.current) return;

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
        resolve();
      };

      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    });
  };

  const processRecording = async () => {
    try {
      setIsProcessing(true);
      await stopRecording();

      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      
      toast({
        title: "Processing",
        description: "Transcribing conversation...",
      });

      // Get procedure codes from parent component or context
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

        {transcript && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Transcript</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{transcript}</p>
            </div>
          </div>
        )}

        {soapNote.subjective && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">SOAP Note</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Subjective</h4>
                <Textarea value={soapNote.subjective} readOnly className="w-full" />
              </div>
              <div>
                <h4 className="font-medium mb-2">Objective</h4>
                <Textarea value={soapNote.objective} readOnly className="w-full" />
              </div>
              <div>
                <h4 className="font-medium mb-2">Assessment</h4>
                <Textarea value={soapNote.assessment} readOnly className="w-full" />
              </div>
              <div>
                <h4 className="font-medium mb-2">Plan</h4>
                <Textarea value={soapNote.plan} readOnly className="w-full" />
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default VoiceRecorder;