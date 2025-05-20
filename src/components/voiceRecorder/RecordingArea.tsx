
import { useTranscription } from "@/contexts/TranscriptionContext";
import { useState, useEffect, useRef } from "react";
import RecordingProvider, { RecordingContextValue } from "../recording/RecordingProvider";
import RecordingControls from "../RecordingControls";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RecordingAreaProps {
  onAudioProcessed: (blob: Blob) => void;
}

const RecordingArea = ({ onAudioProcessed }: RecordingAreaProps) => {
  const { isProcessing } = useTranscription();
  const [networkError, setNetworkError] = useState<string | null>(null);
  const recordingStartTime = useRef<number | null>(null);
  
  // Monitor network status
  useEffect(() => {
    const handleOnline = () => setNetworkError(null);
    const handleOffline = () => setNetworkError("You appear to be offline. Recording will still work, but transcription requires an internet connection.");
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Set initial state
    if (!navigator.onLine) {
      handleOffline();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const handleRecordingStart = () => {
    recordingStartTime.current = Date.now();
    console.log("Recording started at:", new Date().toISOString());
  };
  
  const handleRecordingStop = (blob: Blob) => {
    const endTime = Date.now();
    const duration = recordingStartTime.current ? (endTime - recordingStartTime.current) / 1000 : 0;
    console.log(`Recording stopped. Duration: ${duration.toFixed(2)} seconds, Blob size: ${blob.size} bytes`);
    
    // Log metrics for performance analysis
    try {
      const metrics = {
        recordingDuration: duration,
        blobSize: blob.size,
        blobType: blob.type,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };
      console.log("Recording metrics:", metrics);
    } catch (error) {
      console.error("Error logging metrics:", error);
    }
    
    onAudioProcessed(blob);
  };
  
  const renderRecordingControls = (recordingContext: RecordingContextValue) => {
    return (
      <div className="space-y-4">
        {networkError && (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Network Warning</AlertTitle>
            <AlertDescription>{networkError}</AlertDescription>
          </Alert>
        )}
        
        <RecordingControls
          isRecording={recordingContext.isRecording}
          isPaused={recordingContext.isPaused}
          isProcessing={isProcessing}
          onStartRecording={() => {
            handleRecordingStart();
            recordingContext.startRecording();
          }}
          onStopRecording={async () => {
            const blob = await recordingContext.stopRecording();
            if (blob) handleRecordingStop(blob);
          }}
          onPauseRecording={recordingContext.pauseRecording}
          onResumeRecording={recordingContext.resumeRecording}
        />
      </div>
    );
  };

  return (
    <div>
      <RecordingProvider onAudioProcessed={onAudioProcessed}>
        {(recordingContext: RecordingContextValue) => renderRecordingControls(recordingContext)}
      </RecordingProvider>
      
      {isProcessing && (
        <div className="text-center py-8 space-y-4">
          <div className="flex justify-center items-center mb-2">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
            <p className="text-lg font-medium text-primary">Processing audio...</p>
          </div>
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-24 w-full mx-auto" />
        </div>
      )}
    </div>
  );
};

export default RecordingArea;
