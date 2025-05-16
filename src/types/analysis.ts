
export interface AnalysisResult {
  id: string;
  type: 'image' | 'audio' | 'text';
  content: {
    url?: string;
    text?: string;
    data?: any;
  };
  analysis: {
    summary?: string;
    entities?: any[];
    sentiment?: string;
    confidence?: number;
    recommendations?: string[];
    tags?: string[];
  };
  interpretation?: string;
  findings?: Array<{
    name: string;
    probability: number;
    description: string;
  }>;
  suggestedCodes?: string[];
  created_at: string;
  updated_at: string;
}

export interface ImageAnalysisResult extends AnalysisResult {
  type: 'image';
  analysis: {
    objects?: any[];
    text?: string;
    faces?: any[];
    landmarks?: any[];
    labels?: any[];
    moderation?: any;
    summary?: string;
    confidence?: number;
  };
}

export interface TextAnalysisResult extends AnalysisResult {
  type: 'text';
  analysis: {
    summary?: string;
    entities?: any[];
    sentiment?: string;
    key_phrases?: string[];
    language?: string;
    confidence?: number;
  };
}

export interface AudioAnalysisResult extends AnalysisResult {
  type: 'audio';
  analysis: {
    transcript?: string;
    speakers?: any[];
    segments?: any[];
    confidence?: number;
    sentiment?: string;
    summary?: string;
  };
}

export type Analysis = AnalysisResult | ImageAnalysisResult | TextAnalysisResult | AudioAnalysisResult;

// Wireframe types for planning before implementation
export interface MedicalDocumentationWireframe {
  components: {
    voiceRecorder: {
      states: string[];
      props: any;
    };
    transcriptDisplay: {
      states: string[];
      props: any;
    };
    soapNoteGenerator: {
      states: string[];
      props: any;
    };
  };
  pages: {
    recordingPage: any;
    analysisPage: any;
    notesPage: any;
  };
  workflows: {
    recordingToNote: string[];
  };
}

export interface AndroidAppWireframe {
  appName: string;
  appId: string;
  screens: {
    id: string;
    name: string;
    route: string;
    components: string[];
    description: string;
  }[];
  components: {
    id: string;
    name: string;
    description: string;
    props: string[];
    androidSpecific?: boolean;
  }[];
  nativeFeatures: {
    id: string;
    name: string;
    description: string;
    androidPermission?: string;
    capacitorPlugin?: string;
  }[];
  dataFlow: {
    id: string;
    source: string;
    destination: string;
    dataType: string;
    description: string;
  }[];
  stateManagement: string;
  apiIntegration: string[];
  buildConfiguration: {
    targetSdk: number;
    minSdk: number;
    buildTools: string;
    capacitorVersion: string;
  };
}
