
import { NativeFeature } from "./types";

export const nativeFeatures: NativeFeature[] = [
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
];
