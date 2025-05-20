
import { useEffect, useState, useCallback } from "react";
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
  
  // Use useCallback to prevent unnecessary recreation of this function
  const handleTranscriptionComplete = useCallback((transcript: string, speakers: any[], segments: any[]) => {
    setTranscript(transcript);
    setSpeakers(speakers);
    setSegments(segments);
    
    toast({
      title: "Transcription complete",
      description: "Your audio has been successfully transcribed.",
    });
  }, [setTranscript, setSpeakers, setSegments]);

  // Use useCallback for processing state changes
  const handleProcessingStateChange = useCallback((isProcessing: boolean) => {
    setIsProcessing(isProcessing);
  }, [setIsProcessing]);

  useEffect(() => {
    // Skip if no new audio blob or same blob is being processed
    if (!audioBlob || processingBlob === audioBlob) return;
    
    const processAudio = async () => {
      setProcessingBlob(audioBlob);
      setIsProcessing(true);
      
      toast({
        title: "Processing audio",
        description: "This might take a moment...",
      });
      
      try {
        console.log("Starting audio processing for blob:", audioBlob.size, "bytes");
        
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
        
        // Store the audio blob in IndexedDB for potential offline recovery
        try {
          const request = indexedDB.open("audioCache", 1);
          request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("blobs")) {
              db.createObjectStore("blobs", { keyPath: "id" });
            }
          };
          
          request.onsuccess = () => {
            const db = request.result;
            const tx = db.transaction("blobs", "readwrite");
            const store = tx.objectStore("blobs");
            store.put({ id: Date.now(), blob: audioBlob });
          };
        } catch (dbError) {
          console.warn("IndexedDB not available for audio caching:", dbError);
        }
        
        // Process the audio blob
        const result = await processAudioBlob(
          audioBlob,
          handleTranscriptionComplete,
          handleProcessingStateChange
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
  }, [
    audioBlob, 
    setTranscript, 
    setSoapNote, 
    setSpeakers, 
    setSegments, 
    setIsProcessing, 
    processingBlob,
    handleTranscriptionComplete,
    handleProcessingStateChange
  ]);

  return null; // This is a logic component, no UI
};

export default AudioProcessingHandler;
