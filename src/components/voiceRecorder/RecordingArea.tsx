
import { useTranscription } from "@/contexts/TranscriptionContext";
import { useState, useEffect } from "react";
import RecordingProvider, { RecordingContextValue } from "../recording/RecordingProvider";
import RecordingControls from "../RecordingControls";
import { Skeleton } from "@/components/ui/skeleton";

interface RecordingAreaProps {
  onAudioProcessed: (blob: Blob) => void;
}

const RecordingArea = ({ onAudioProcessed }: RecordingAreaProps) => {
  const { isProcessing } = useTranscription();
  
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
    <div>
      <RecordingProvider onAudioProcessed={onAudioProcessed}>
        {(recordingContext: RecordingContextValue) => renderRecordingControls(recordingContext)}
      </RecordingProvider>
      
      {isProcessing && (
        <div className="text-center py-8">
          <Skeleton className="h-8 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-24 w-full mx-auto" />
        </div>
      )}
    </div>
  );
};

export default RecordingArea;
