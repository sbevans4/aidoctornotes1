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
    <div className="flex justify-center">
      {!isProcessing && (
        <Button
          onClick={isRecording ? onStopRecording : onStartRecording}
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
  );
};

export default RecordingControls;