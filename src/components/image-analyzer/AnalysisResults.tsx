
import React from 'react';
import { AnalysisResult } from '@/types/analysis';
import { Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

const AnalysisResults = ({ result, isAnalyzing }: AnalysisResultsProps) => {
  if (!isAnalyzing && !result) return null;

  return (
    <div className="mt-6 space-y-4">
      {isAnalyzing && (
        <div className="flex items-center gap-2 text-blue-600 p-4 bg-blue-50 rounded-md">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Analyzing image with AI. This may take up to 30 seconds...</span>
        </div>
      )}

      {result && (
        <Tabs defaultValue="interpretation" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="interpretation">Interpretation</TabsTrigger>
            <TabsTrigger value="findings">Findings</TabsTrigger>
            <TabsTrigger value="codes">Suggested Codes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="interpretation" className="mt-4">
            <Card className="p-4 bg-slate-50">
              <h4 className="text-lg font-semibold mb-2">Medical Interpretation</h4>
              <div className="whitespace-pre-wrap">
                {result.interpretation}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="findings" className="mt-4">
            {result.findings && result.findings.length > 0 ? (
              <div className="space-y-4">
                {result.findings.map((finding, index) => (
                  <div key={index} className="bg-white p-4 border rounded-md">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium">{finding.name}</h5>
                      <Badge 
                        variant={finding.probability > 0.7 ? "destructive" : finding.probability > 0.4 ? "default" : "secondary"}
                      >
                        {Math.round(finding.probability * 100)}% probability
                      </Badge>
                    </div>
                    <Progress value={finding.probability * 100} className="h-2 mb-2" />
                    <p className="text-sm text-gray-600">{finding.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <AlertTriangle className="h-10 w-10 mb-2" />
                <p>No specific findings were identified by the AI analysis.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="codes" className="mt-4">
            {result.suggestedCodes && result.suggestedCodes.length > 0 ? (
              <div className="bg-white p-4 border rounded-md">
                <h4 className="text-lg font-semibold mb-4">Suggested Medical Codes</h4>
                <div className="flex flex-wrap gap-2">
                  {result.suggestedCodes.map((code, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-1 px-3">
                      {code}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center text-gray-500">
                <AlertTriangle className="h-10 w-10 mb-2" />
                <p>No medical codes were suggested for this image.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AnalysisResults;
