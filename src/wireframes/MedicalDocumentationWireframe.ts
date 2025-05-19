import { AndroidAppWireframe } from "../types/analysis";

export const medicalDocumentationWireframe: AndroidAppWireframe = {
  appName: "AIDoctorNotes Medical",
  appId: "app.lovable.aidoctornotes.medical",
  
  screens: [
    {
      id: "auth",
      name: "Authentication Screen",
      route: "/auth",
      components: ["GoogleSignInButton", "SignUpForm", "SignInForm"],
      description: "Handles user authentication with multiple sign-in options"
    },
    {
      id: "landing",
      name: "Landing Page",
      route: "/",
      components: ["HeroSection", "FeaturesSection", "PricingSection", "CTASection"],
      description: "Initial landing page for non-authenticated users with marketing content"
    },
    {
      id: "dashboard",
      name: "Dashboard",
      route: "/dashboard",
      components: ["QuickActions", "RecentActivity", "RoleSelection"],
      description: "User dashboard showing recent activities and quick action buttons"
    },
    {
      id: "voice-recording",
      name: "Voice Recording",
      route: "/medical-documentation",
      components: ["VoiceRecorder", "TranscriptDisplay", "SoapNoteDisplay", "RecordingControls"],
      description: "Main recording interface for capturing and processing medical conversations"
    },
    {
      id: "image-analysis",
      name: "Image Analysis",
      route: "/medical-documentation/image",
      components: ["ImageUploadButtons", "ImagePreview", "AnalysisResults"],
      description: "Interface for uploading and analyzing medical images"
    },
    {
      id: "subscription",
      name: "Subscription Plans",
      route: "/subscription-plans",
      components: ["SubscriptionPlanCard", "PaymentForm"],
      description: "Subscription options and payment processing"
    }
  ],
  
  components: [
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
  ],
  
  nativeFeatures: [
    {
      id: "audioRecording",
      name: "Audio Recording",
      androidPermission: "android.permission.RECORD_AUDIO",
      capacitorPlugin: "@capacitor/microphone",
      description: "Access to device microphone for voice recording"
    },
    {
      id: "cameraAccess",
      name: "Camera Access",
      androidPermission: "android.permission.CAMERA",
      capacitorPlugin: "@capacitor/camera",
      description: "Access to device camera for capturing medical images"
    },
    {
      id: "fileSystem",
      name: "File System Access",
      androidPermission: "android.permission.READ_EXTERNAL_STORAGE",
      capacitorPlugin: "@capacitor/filesystem",
      description: "Read/write access to device storage for saving recordings and images"
    },
    {
      id: "notifications",
      name: "Push Notifications",
      androidPermission: "android.permission.POST_NOTIFICATIONS",
      capacitorPlugin: "@capacitor/push-notifications",
      description: "Send notifications for recording status and processing completion"
    },
    {
      id: "backgroundTasks",
      name: "Background Processing",
      capacitorPlugin: "@capacitor/background-task",
      description: "Allow transcription processing to continue in background"
    },
    {
      id: "shareExtension",
      name: "Share Extension",
      capacitorPlugin: "@capacitor/share",
      description: "Allow sharing of SOAP notes and transcripts"
    },
    {
      id: "biometricAuth",
      name: "Biometric Authentication",
      capacitorPlugin: "@capacitor/biometric",
      androidPermission: "android.permission.USE_BIOMETRIC",
      description: "Secure access to medical notes using device biometrics"
    }
  ],
  
  dataFlow: [
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
  ],
  
  stateManagement: "React Query + Context API",
  
  apiIntegration: [
    "Supabase Authentication API",
    "OpenAI GPT-4 API (for SOAP note generation)",
    "OpenAI Whisper API (for transcription)",
    "OpenAI Vision API (for image analysis)",
    "Stripe/PayPal Payment APIs"
  ],
  
  buildConfiguration: {
    targetSdk: 33,
    minSdk: 24,
    buildTools: "33.0.0",
    capacitorVersion: "5.7.0"
  }
};
