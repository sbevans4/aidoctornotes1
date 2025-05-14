
export interface AnalysisResult {
  interpretation: string;
  suggestedCodes?: string[];
  diagnosisConfidence?: number;
  findings?: {
    name: string;
    probability: number;
    description: string;
  }[];
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
    androidPermission?: string;
    capacitorPlugin?: string;
    description: string;
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
