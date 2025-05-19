
import { DataFlow } from "./types";

export const dataFlow: DataFlow[] = [
  {
    id: "audioCapture",
    source: "RecordingControls",
    destination: "VoiceRecorder",
    dataType: "AudioBlob",
    description: "Raw audio data flow from recording UI to processing component"
  },
  {
    id: "transcriptionProcess",
    source: "VoiceRecorder",
    destination: "TranscriptionProcessor",
    dataType: "AudioBlob",
    description: "Send captured audio to transcription service"
  },
  {
    id: "transcriptDisplay",
    source: "TranscriptionProcessor",
    destination: "TranscriptDisplay",
    dataType: "TranscriptData",
    description: "Processed transcript sent to display component"
  },
  {
    id: "soapGeneration",
    source: "TranscriptionProcessor",
    destination: "SoapNoteDisplay",
    dataType: "SoapNoteData",
    description: "Generated SOAP note data flow to display component"
  },
  {
    id: "imageCapture",
    source: "ImageUploadButtons",
    destination: "ImageAnalyzer",
    dataType: "ImageFile",
    description: "Image file flow from capture UI to analysis component"
  },
  {
    id: "imageAnalysis",
    source: "ImageAnalyzer",
    destination: "AnalysisResults",
    dataType: "AnalysisResult",
    description: "Analysis results flow to display component"
  }
];
