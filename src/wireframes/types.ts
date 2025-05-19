
import { AnalysisResult } from "../types/analysis";

// Base wireframe types
export interface Screen {
  id: string;
  name: string;
  route: string;
  components: string[];
  description: string;
}

export interface Component {
  id: string;
  name: string;
  description: string;
  props: string[];
  androidSpecific?: boolean;
}

export interface NativeFeature {
  id: string;
  name: string;
  description: string;
  androidPermission?: string;
  capacitorPlugin?: string;
}

export interface DataFlow {
  id: string;
  source: string;
  destination: string;
  dataType: string;
  description: string;
}

export interface BuildConfiguration {
  targetSdk: number;
  minSdk: number;
  buildTools: string;
  capacitorVersion: string;
}

export interface AndroidAppWireframe {
  appName: string;
  appId: string;
  screens: Screen[];
  components: Component[];
  nativeFeatures: NativeFeature[];
  dataFlow: DataFlow[];
  stateManagement: string;
  apiIntegration: string[];
  buildConfiguration: BuildConfiguration;
}
