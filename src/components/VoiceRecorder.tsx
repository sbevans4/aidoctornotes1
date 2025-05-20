
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
import RecordingProvider, { RecordingContextValue } from "./recording/RecordingProvider";
import { processAudioBlob } from "@/utils/audioProcessing";
import ProcedureCodeValidator from "./procedure-codes/ProcedureCodeValidator";

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
  const [procedureCodes, setProcedureCodes] = useState<string[]>([]);
  
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
  
  const handleProcedureCodesValidated = (codes: string[]) => {
    setProcedureCodes(codes);
    if (transcript && codes.length > 0) {
      // Once we have both transcript and procedure codes, generate SOAP note
      generateSoapNote(transcript, codes);
    }
  };
  
  const generateSoapNote = async (transcriptText: string, codes: string[]) => {
    if (!transcriptText || codes.length === 0) return;
    
    setIsProcessing(true);
    toast({
      title: "Generating SOAP note",
      description: "Please wait while we analyze the transcription...",
    });
    
    try {
      await SoapNoteGenerator({
        transcript: transcriptText,
        procedureCodes: codes,
        templateId: selectedTemplateId,
        onSoapNoteGenerated: handleSoapNoteGenerated,
      });
    } catch (error) {
      console.error("Error generating SOAP note:", error);
      toast({
        title: "Error",
        description: "Failed to generate the SOAP note. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
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
        handleProcessingStateChange,
        selectedTemplateId
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
  
  const renderRecordingControls = (recordingContext: RecordingContextValue) => {
    return (
      <RecordingControls
        isRecording={recordingContext.isRecording}
        isPaused={recordingContext.isPaused}
        isProcessing={isProcessing}
        onStartRecording={recordingContext.startRecording}
        onStopRecording={recordingContext.stopRecording}
        onPauseRecording={recordingContext.pauseRecording}
        onResumeRecording={recordingContext.resumeRecording}
      />
    );
  };
  
  return (
    <div className="space-y-6">
      <TemplateSelector 
        selectedTemplateId={selectedTemplateId}
        onChange={handleTemplateChange}
      />
      
      <Card className="p-6">
        <RecordingProvider onAudioProcessed={handleAudioProcessed}>
          {(recordingContext: RecordingContextValue) => renderRecordingControls(recordingContext)}
        </RecordingProvider>
        
        {isProcessing && (
          <div className="text-center py-8">
            <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
            <Skeleton className="h-24 w-full mx-auto" />
          </div>
        )}
        
        {transcript && !isProcessing && (
          <div className="mt-6">
            <TranscriptDisplay
              transcript={transcript}
              speakers={speakers}
              segments={segments}
            />
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Enter Procedure Codes</h3>
              <p className="text-sm text-gray-600 mb-4">
                Enter the relevant procedure codes to ensure accurate SOAP note generation
              </p>
              <ProcedureCodeValidator onValidate={handleProcedureCodesValidated} />
            </div>
          </div>
        )}
        
        {soapNote.subjective && !isProcessing && (
          <div className="mt-6">
            <SoapNoteDisplay soapNote={soapNote} />
          </div>
        )}
        
        <TranscriptionProcessor
          onTranscriptionComplete={handleTranscriptionComplete}
          onSoapNoteGenerated={handleSoapNoteGenerated}
          onProcessingStateChange={handleProcessingStateChange}
          selectedTemplateId={selectedTemplateId}
        />
      </Card>
    </div>
  );
};

export default VoiceRecorder;
