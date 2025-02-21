
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRecording) {
      setElapsedTime(0);
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      isRecording ? onStopRecording() : onStartRecording();
    }
  };

  return (
    <div 
      className="flex flex-col items-center justify-center gap-4"
      role="region" 
      aria-label="Voice Recording Controls"
    >
      {!isProcessing && (
        <>
          <div className="relative">
            <div 
              className={`absolute -inset-1 rounded-full transition-opacity duration-1000 ${
                isRecording 
                  ? "bg-red-500/30 animate-ping" 
                  : "opacity-0"
              }`} 
              aria-hidden="true"
            />
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    onKeyDown={handleKeyPress}
                    className={`w-16 h-16 rounded-full transition-all duration-200 transform active:scale-95 focus:ring-2 focus:ring-offset-2 ${
                      isRecording 
                        ? "bg-red-500 hover:bg-red-600 shadow-lg focus:ring-red-500" 
                        : "bg-medical-primary hover:bg-medical-secondary focus:ring-medical-primary"
                    }`}
                    aria-label={isRecording ? "Stop Recording" : "Start Recording"}
                    aria-pressed={isRecording}
                    role="switch"
                  >
                    {isRecording ? (
                      <Square className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Mic className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording 
                    ? "Click to stop recording" 
                    : "Click to start recording your medical notes"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-col items-center gap-1">
            {isRecording && (
              <span 
                className="text-sm font-semibold text-red-500"
                role="timer"
                aria-label="Recording duration"
              >
                {formatTime(elapsedTime)}
              </span>
            )}
            <span 
              className="text-sm font-medium text-gray-600"
              role="status"
              aria-live="polite"
            >
              {isRecording 
                ? "Recording in progress..." 
                : "Press Space or Enter to start recording"}
            </span>
          </div>
        </>
      )}
      
      {isProcessing && (
        <div 
          className="flex flex-col items-center justify-center gap-2"
          role="status"
          aria-live="polite"
        >
          <Loader2 
            className="h-6 w-6 animate-spin text-medical-primary" 
            aria-hidden="true"
          />
          <span className="text-sm font-medium text-gray-600">Processing your recording...</span>
        </div>
      )}
    </div>
  );
};

export default RecordingControls;
