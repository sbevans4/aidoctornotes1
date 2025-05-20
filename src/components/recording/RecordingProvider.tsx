
import { useState, useRef, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface RecordingProviderProps {
  children: ReactNode | ((context: RecordingContextValue) => ReactNode);
  onAudioProcessed: (audioBlob: Blob) => void;
}

export interface RecordingContextValue {
  isRecording: boolean;
  isPaused: boolean;
  elapsedTime: number;
  startRecording: () => void;
  stopRecording: () => Promise<void>; // Updated to return Promise<void>
  pauseRecording: () => void;
  resumeRecording: () => void;
}

const RecordingProvider = ({ children, onAudioProcessed }: RecordingProviderProps) => {
  const { user } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setIsPaused(false);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Microphone Access Error",
        description: "Failed to access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };
  
  const stopRecording = async (): Promise<void> => {
    if (mediaRecorderRef.current) {
      return new Promise<void>((resolve) => {
        if (!mediaRecorderRef.current) {
          resolve();
          return;
        }
        
        // Process audio when stopped
        mediaRecorderRef.current.onstop = () => {
          // Clear timer
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          
          // Save recording metadata to Supabase
          if (user) {
            try {
              // Fix: Convert the Supabase Promise to a standard Promise with then/catch
              const saveRecordingMetadata = async () => {
                try {
                  const { error } = await supabase.from("recordings").insert({
                    user_id: user.id,
                    title: `Recording ${new Date().toLocaleString()}`,
                    duration: Math.floor(elapsedTime) // In seconds
                  });
                  
                  if (error) {
                    console.error("Error saving recording metadata:", error);
                  } else {
                    console.log("Recording metadata saved to database");
                  }
                } catch (error) {
                  console.error("Error saving recording metadata:", error);
                }
              };
              
              // Execute the async function
              saveRecordingMetadata();
            } catch (error) {
              console.error("Error saving recording metadata:", error);
            }
          }
          
          // Process audio
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          onAudioProcessed(audioBlob);
          
          // Reset state
          setIsRecording(false);
          setIsPaused(false);
          setElapsedTime(0);
          
          resolve();
        };
        
        // Stop recording
        mediaRecorderRef.current.stop();
        
        // Stop all tracks in the stream
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      });
    }
    
    return Promise.resolve();
  };
  
  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "paused") {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
  };
  
  const value: RecordingContextValue = {
    isRecording,
    isPaused,
    elapsedTime,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording
  };
  
  return (
    <>
      {typeof children === 'function' 
        ? children(value) 
        : children}
    </>
  );
};

export default RecordingProvider;
