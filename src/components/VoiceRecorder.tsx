import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, Square, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";

const VoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [soapNote, setSoapNote] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  });
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      
      mediaRecorder.current.ondataavailable = async (event) => {
        if (event.data.size > 0) {
          // Here we'll handle the audio data and transcription
          setTranscript("Sample transcription: Patient presents with...");
          generateSoapNote("Sample transcription: Patient presents with...");
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

  const stopRecording = () => {
    if (mediaRecorder.current && isRecording) {
      mediaRecorder.current.stop();
      mediaRecorder.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      
      toast({
        title: "Recording Stopped",
        description: "Processing conversation...",
      });
    }
  };

  const generateSoapNote = (transcription: string) => {
    // This is a placeholder for the SOAP note generation logic
    // In a real implementation, this would analyze the transcription
    // and procedure codes to generate appropriate notes
    setSoapNote({
      subjective: "Patient reports...",
      objective: "Clinical examination reveals...",
      assessment: "Based on the findings...",
      plan: "Treatment plan includes...",
    });
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        <div className="flex justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
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
        </div>
        
        {isRecording && (
          <div className="flex items-center justify-center text-medical-primary">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="animate-pulse-recording">Recording...</span>
          </div>
        )}

        {transcript && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Transcript</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{transcript}</p>
            </div>
          </div>
        )}

        {transcript && (
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