
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
    selectedTemplateId,
  } = useTranscription();

  const handleTranscriptionComplete = (
    transcript: string,
    speakers: any[],
    segments: any[]
  ) => {
    setTranscript(transcript);
    setSpeakers(speakers);
    setSegments(segments);
    toast({
      title: "Transcription complete",
      description: "Your audio has been successfully transcribed.",
    });
  };
  
  const handleSoapNoteGenerated = (soapNote: any) => {
    setSoapNote(soapNote);
    toast({
      title: "SOAP note generated",
      description: "Your clinical note is ready for review.",
    });
    setIsProcessing(false);
  };
  
  // Process audio when blob is provided
  if (audioBlob) {
    const processAudio = async () => {
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
        
        await processAudioBlob(
          audioBlob, 
          handleTranscriptionComplete, 
          handleSoapNoteGenerated,
          setIsProcessing,
          selectedTemplateId
        );
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
  }

  return null; // This is a logic component, no UI
};

export default AudioProcessingHandler;
