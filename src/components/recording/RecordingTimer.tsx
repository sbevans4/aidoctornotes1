
import { useState, useEffect } from "react";

interface RecordingTimerProps {
  isRecording: boolean;
  isPaused: boolean;
}

const RecordingTimer = ({ isRecording, isPaused }: RecordingTimerProps) => {
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

  return (
    <span 
      className={`text-sm font-semibold ${isPaused ? "text-amber-500" : "text-red-500"}`}
      role="timer"
      aria-label="Recording duration"
    >
      {formatTime(elapsedTime)} {isPaused && "(Paused)"}
    </span>
  );
};

export default RecordingTimer;
