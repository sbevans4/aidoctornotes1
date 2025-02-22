
import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Camera, Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AnalysisResult {
  interpretation: string;
  suggestedCodes?: string[];
}

const ImageAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

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

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

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
            model: "gpt-4-vision-preview",
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
        
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => triggerFileInput('gallery')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            Choose from Gallery
          </Button>
          
          <Button 
            onClick={() => triggerFileInput('camera')}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Camera className="w-4 h-4" />
            Take Photo
          </Button>

          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            ref={fileInputRef}
          />

          <Input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageUpload}
            className="hidden"
            ref={cameraInputRef}
          />
        </div>

        {previewUrl && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
            <div className="relative max-w-md border rounded-lg overflow-hidden">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto"
              />
            </div>
          </div>
        )}

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
      </div>
    </Card>
  );
};

export default ImageAnalyzer;
