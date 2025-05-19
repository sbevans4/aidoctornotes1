
import { Screen } from "./types";

export const screens: Screen[] = [
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
];
