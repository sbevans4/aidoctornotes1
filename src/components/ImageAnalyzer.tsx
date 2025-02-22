
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/types/analysis";
import { analyzeImage, validateImageFile } from "@/utils/imageAnalysis";
import ImageUploadButtons from "./image-analyzer/ImageUploadButtons";
import ImagePreview from "./image-analyzer/ImagePreview";
import AnalysisResults from "./image-analyzer/AnalysisResults";

const ImageAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      setIsAnalyzing(true);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64Image = reader.result as string;
        const analysisResult = await analyzeImage(base64Image);
        setResult(analysisResult);
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

  const triggerFileInput = (type: 'camera' | 'gallery') => {
    if (type === 'camera') {
      cameraInputRef.current?.click();
    } else {
      fileInputRef.current?.click();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    const imageItem = Array.from(items).find(item => item.type.indexOf('image') !== -1);
    
    if (imageItem) {
      const file = imageItem.getAsFile();
      if (file) {
        const input = new DataTransfer();
        input.items.add(file);
        
        if (fileInputRef.current) {
          fileInputRef.current.files = input.files;
          const event = new Event('change', { bubbles: true });
          fileInputRef.current.dispatchEvent(event);
        }
      }
    }
  };

  return (
    <Card className="p-6 max-w-4xl mx-auto" onPaste={handlePaste}>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Medical Image Analysis</h2>
        <p className="text-muted-foreground">
          Upload a medical image for AI-powered analysis and interpretation.
          You can use your camera, select from gallery, or paste a screenshot.
        </p>
        
        <ImageUploadButtons
          onTriggerFileInput={triggerFileInput}
          fileInputRef={fileInputRef}
          cameraInputRef={cameraInputRef}
          onImageUpload={handleImageUpload}
        />

        {previewUrl && <ImagePreview url={previewUrl} />}

        <AnalysisResults 
          result={result}
          isAnalyzing={isAnalyzing}
        />
      </div>
    </Card>
  );
};

export default ImageAnalyzer;

