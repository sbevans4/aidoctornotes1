
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNetworkStatus } from "@/hooks/use-network-status";
import { useMedicalTranscription } from "@/hooks/useMedicalTranscription";
import { useSoapNoteGeneration, SoapNote } from "@/hooks/useSoapNoteGeneration";
import AudioRecorder from "@/components/AudioRecorder";
import TranscriptDisplay from "@/components/TranscriptDisplay";
import SoapNoteDisplay from "@/components/SoapNoteDisplay";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { OfflineNotification } from "@/components/ui/offline-notification";

const MedicalDocumentationForm = () => {
  const { isOnline } = useNetworkStatus();
  const { user } = useAuth();
  
  const { 
    audioBlob,
    isTranscribing,
    transcript,
    speakers,
    segments,
    noteId,
    transcriptionError,
    handleRecordingComplete,
    resetTranscription
  } = useMedicalTranscription();
  
  const {
    isGeneratingSoap,
    soapNote,
    soapError,
    generateSoapNote,
    saveSoapNote,
    emailSoapNote,
    resetSoapNote
  } = useSoapNoteGeneration();

  // Generate SOAP note when transcript is available
  React.useEffect(() => {
    if (transcript && noteId) {
      generateSoapNote(transcript, noteId);
    }
  }, [transcript, noteId]);

  const handleReset = () => {
    resetTranscription();
    resetSoapNote();
  };

  const handleSaveSoapNote = async (note: SoapNote) => {
    if (!noteId) return;
    await saveSoapNote(note, noteId);
  };

  if (!isOnline) {
    return <OfflineNotification />;
  }

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <div className="grid gap-6 md:gap-8">
        {/* Step 1: Record Audio */}
        <div className={transcript ? "opacity-50" : ""}>
          <AudioRecorder 
            onRecordingComplete={handleRecordingComplete} 
            className="w-full"
          />
        </div>
        
        {/* Step 2: Transcription */}
        {(isTranscribing || transcript || transcriptionError) && (
          <TranscriptDisplay 
            transcript={transcript || undefined}
            speakers={speakers}
            segments={segments}
            isLoading={isTranscribing}
            error={transcriptionError || undefined}
          />
        )}
        
        {/* Step 3: SOAP Note */}
        {(isGeneratingSoap || soapNote || soapError) && (
          <SoapNoteDisplay 
            soapNote={soapNote || undefined}
            isLoading={isGeneratingSoap}
            error={soapError || undefined}
            onSave={handleSaveSoapNote}
            onEmail={emailSoapNote}
          />
        )}
        
        {/* Reset Button */}
        {(transcript || soapNote) && (
          <div className="flex justify-center">
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Start New Documentation
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalDocumentationForm;
