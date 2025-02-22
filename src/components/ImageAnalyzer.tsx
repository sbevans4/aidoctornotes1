
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AnalysisResult {
  interpretation: string;
  suggestedCodes?: string[];
}

const ImageAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Only accept images
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsAnalyzing(true);
      
      // Convert image to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        
        // Call OpenAI API to analyze the image
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: "You are a medical image analysis assistant. Analyze the provided medical image and provide a detailed interpretation. Focus on key findings, potential diagnoses, and any notable abnormalities."
              },
              {
                role: "user",
                content: [
                  { type: "text", text: "Please analyze this medical image and provide interpretation:" },
                  { type: "image_url", image_url: base64Image }
                ]
              }
            ]
          })
        });

        if (!response.ok) {
          throw new Error('Failed to analyze image');
        }

        const data = await response.json();
        setResult({
          interpretation: data.choices[0].message.content,
          suggestedCodes: [], // We could add ICD/CPT code suggestions here
        });
      };

    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Medical Image Analysis</h2>
        <p className="text-muted-foreground">
          Upload a medical image for AI-powered analysis and interpretation.
        </p>
        
        <div className="flex items-center gap-4">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isAnalyzing}
            className="max-w-sm"
          />
          {isAnalyzing && (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing...</span>
            </div>
          )}
        </div>

        {result && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold">Analysis Results</h3>
            <div className="bg-slate-50 p-4 rounded-lg whitespace-pre-wrap">
              {result.interpretation}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ImageAnalyzer;
