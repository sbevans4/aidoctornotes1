
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square, Pause, Play, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
}

const RecordingControls = ({
  isRecording,
  isPaused,
  isProcessing,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
}: RecordingControlsProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRecording && !isPaused) {
      intervalId = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording) {
      setElapsedTime(0);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording, isPaused]);

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
                    onClick={isRecording ? 
                      (isPaused ? onResumeRecording : onPauseRecording) : 
                      onStartRecording}
                    onKeyDown={handleKeyPress}
                    className={`w-16 h-16 rounded-full transition-all duration-200 transform active:scale-95 focus:ring-2 focus:ring-offset-2 ${
                      isRecording 
                        ? "bg-red-500 hover:bg-red-600 shadow-lg focus:ring-red-500" 
                        : "bg-medical-primary hover:bg-medical-secondary focus:ring-medical-primary"
                    }`}
                    aria-label={isRecording ? (isPaused ? "Resume Recording" : "Pause Recording") : "Start Recording"}
                    aria-pressed={isRecording}
                    role="switch"
                  >
                    {isRecording ? (
                      isPaused ? 
                        <Play className="h-6 w-6" aria-hidden="true" /> : 
                        <Pause className="h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Mic className="h-6 w-6" aria-hidden="true" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isRecording 
                    ? (isPaused ? "Click to resume recording" : "Click to pause recording") 
                    : "Click to start recording your medical notes"}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {isRecording && (
            <Button
              onClick={onStopRecording}
              variant="outline"
              size="sm"
              className="bg-white border-red-400 text-red-500 hover:bg-red-50"
            >
              <Square className="h-4 w-4 mr-2" /> Stop Recording
            </Button>
          )}

          <div className="flex flex-col items-center gap-1">
            {isRecording && (
              <span 
                className={`text-sm font-semibold ${isPaused ? "text-amber-500" : "text-red-500"}`}
                role="timer"
                aria-label="Recording duration"
              >
                {formatTime(elapsedTime)} {isPaused && "(Paused)"}
              </span>
            )}
            <span 
              className="text-sm font-medium text-gray-600"
              role="status"
              aria-live="polite"
            >
              {isRecording 
                ? (isPaused ? "Recording paused" : "Recording in progress...") 
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
