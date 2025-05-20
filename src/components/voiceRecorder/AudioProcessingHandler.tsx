
import { useEffect, useState } from "react";
import { useTranscription } from "@/contexts/TranscriptionContext";
import { toast } from "@/hooks/use-toast";
import { processAudioBlob } from "@/utils/audioProcessing";

interface AudioProcessingHandlerProps {
  audioBlob?: Blob;
}

const AudioProcessingHandler = ({ audioBlob }: AudioProcessingHandlerProps) => {
  const {
    setTranscript,
    setSoapNote,
    setSpeakers,
    setSegments,
    setIsProcessing,
  } = useTranscription();
  const [processingBlob, setProcessingBlob] = useState<Blob | null>(null);

  useEffect(() => {
    if (!audioBlob || processingBlob === audioBlob) return;
    
    const processAudio = async () => {
      setProcessingBlob(audioBlob);
      setIsProcessing(true);
      toast({
        title: "Processing audio",
        description: "This might take a moment...",
      });
      
      try {
        // Reset state for new processing
        setTranscript("");
        setSoapNote({
          subjective: "",
          objective: "",
          assessment: "",
          plan: "",
        });
        setSpeakers([]);
        setSegments([]);
        
        const result = await processAudioBlob(
          audioBlob, 
          (transcript, speakers, segments) => {
            setTranscript(transcript);
            setSpeakers(speakers);
            setSegments(segments);
            toast({
              title: "Transcription complete",
              description: "Your audio has been successfully transcribed.",
            });
          },
          setIsProcessing
        );
        
        if (result) {
          setTranscript(result.text);
          setSpeakers(result.speakers);
          setSegments(result.segments);
        }
      } catch (error) {
        console.error("Error processing audio:", error);
        toast({
          title: "Processing Error",
          description: "Failed to process the audio. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
      }
    };
    
    processAudio();
  }, [audioBlob, setTranscript, setSoapNote, setSpeakers, setSegments, setIsProcessing, processingBlob]);

  return null; // This is a logic component, no UI
};

export default AudioProcessingHandler;
