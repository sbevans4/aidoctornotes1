
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
