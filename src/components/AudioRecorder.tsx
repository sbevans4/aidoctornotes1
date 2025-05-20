
import React, { useState, useRef } from 'react';
import { Mic, Square, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { motion } from 'framer-motion';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  className?: string;
}

export default function AudioRecorder({ onRecordingComplete, className = '' }: AudioRecorderProps) {
  const { isRecording, startRecording, stopRecording } = useAudioRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleStartRecording = async () => {
    try {
      await startRecording();
      // Start timer for recording duration
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (error) {
      toast({
        title: "Microphone Access Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = async () => {
    setIsProcessing(true);
    
    try {
      // Clear the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      // Get the recorded audio
      const audioBlob = await stopRecording();
      if (audioBlob) {
        onRecordingComplete(audioBlob);
        toast({
          title: "Recording Complete",
          description: `Audio recorded (${formatDuration(recordingDuration)})`,
        });
      }
    } catch (error) {
      toast({
        title: "Recording Error",
        description: "There was an error processing your recording.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`shadow-md ${className}`}>
      <CardHeader>
        <CardTitle>Record Conversation</CardTitle>
        <CardDescription>
          Capture audio for transcription and SOAP note generation
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="mb-6">
          {isRecording && (
            <div className="text-center mb-4">
              <div className="text-2xl font-semibold">{formatDuration(recordingDuration)}</div>
              <p className="text-sm text-gray-500">Recording in progress</p>
            </div>
          )}
          
          {isRecording ? (
            <motion.div 
              className="relative w-24 h-24 flex items-center justify-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div 
                className="absolute w-full h-full rounded-full bg-red-100"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
              <motion.div className="z-10">
                <Button
                  size="lg"
                  variant="destructive"
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  onClick={handleStopRecording}
                  disabled={isProcessing}
                >
                  {isProcessing ? <Loader className="animate-spin h-6 w-6" /> : <Square className="h-6 w-6" />}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <Button
              size="lg"
              variant="default"
              className="w-16 h-16 rounded-full flex items-center justify-center"
              onClick={handleStartRecording}
            >
              <Mic className="h-6 w-6" />
            </Button>
          )}
        </div>
        
        <p className="text-sm text-center text-gray-500 max-w-xs">
          {isRecording
            ? "Click the stop button when you're finished recording"
            : "Click the microphone to start recording your conversation"}
        </p>
      </CardContent>
    </Card>
  );
}
