
import { Component } from "./types";

export const components: Component[] = [
  {
    id: "voiceRecorder",
    name: "VoiceRecorder",
    description: "Core component for recording audio, handles recording state and audio processing",
    props: ["onRecordingComplete"]
  },
  {
    id: "transcriptDisplay",
    name: "TranscriptDisplay",
    description: "Displays conversation transcript with speaker identification",
    props: ["transcript", "speakers", "segments"]
  },
  {
    id: "soapNoteDisplay",
    name: "SoapNoteDisplay",
    description: "Displays SOAP note with editable sections",
    props: ["soapNote", "editable"]
  },
  {
    id: "recordingControls",
    name: "RecordingControls",
    description: "Controls for starting/stopping recording with visual feedback",
    props: ["isRecording", "isProcessing", "onStartRecording", "onStopRecording"]
  },
  {
    id: "imageAnalyzer",
    name: "ImageAnalyzer",
    description: "Component for uploading and analyzing medical images",
    props: []
  },
  {
    id: "quickActions",
    name: "QuickActions",
    description: "Dashboard component with quick action buttons",
    props: ["currentSubscription"]
  },
  {
    id: "recentActivity",
    name: "RecentActivity",
    description: "Displays recent notes and activities",
    props: ["recentNotes"]
  },
  {
    id: "nativeFilePicker",
    name: "NativeFilePicker",
    description: "Android-optimized file picker component",
    props: ["onFileSelect", "fileTypes"],
    androidSpecific: true
  },
  {
    id: "nativeRecordingIndicator",
    name: "NativeRecordingIndicator",
    description: "Android-specific recording indicator with notification",
    props: ["isRecording", "recordingTime"],
    androidSpecific: true
  }
];
