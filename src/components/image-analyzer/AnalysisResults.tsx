
import React from 'react';
import { AnalysisResult } from '@/types/analysis';
import { Loader2 } from "lucide-react";

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const AnalysisResults = ({ result, isAnalyzing }: AnalysisResultsProps) => {
  if (!isAnalyzing && !result) return null;

  return (
    <>
      {isAnalyzing && (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Analyzing...</span>
        </div>
      )}

      {result && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Analysis Results</h3>
          <div className="bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
            {result.interpretation}
          </div>
        </div>
      )}
    </>
  );
};

export default AnalysisResults;

