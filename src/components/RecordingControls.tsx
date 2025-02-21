
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const RecordingControls = ({
  isRecording,
  isProcessing,
  onStartRecording,
  onStopRecording,
}: RecordingControlsProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {!isProcessing && (
        <>
          <Button
            onClick={isRecording ? onStopRecording : onStartRecording}
            className={`w-16 h-16 rounded-full transition-all duration-200 transform active:scale-95 ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600 shadow-lg" 
                : "bg-medical-primary hover:bg-medical-secondary"
            }`}
            aria-label={isRecording ? "Stop Recording" : "Start Recording"}
          >
            {isRecording ? (
              <Square className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          <span className="text-sm font-medium text-gray-600">
            {isRecording ? "Recording..." : "Click to record"}
          </span>
        </>
      )}
      
      {isProcessing && (
        <div className="flex flex-col items-center justify-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-medical-primary" />
          <span className="text-sm font-medium text-gray-600">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
