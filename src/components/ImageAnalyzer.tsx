
import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/types/analysis";
import { analyzeImage, validateImageFile, checkImageAnalysisAccess } from "@/utils/imageAnalysis";
import ImageUploadButtons from "./image-analyzer/ImageUploadButtons";
import ImagePreview from "./image-analyzer/ImagePreview";
import AnalysisResults from "./image-analyzer/AnalysisResults";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";

const ImageAnalyzer = () => {
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const { checkFeatureAccess } = useSubscription();

  useEffect(() => {
    const checkAccess = async () => {
      const hasFeatureAccess = await checkFeatureAccess("image_analysis");
      setHasAccess(hasFeatureAccess);
    };
    
    checkAccess();
  }, [checkFeatureAccess]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    // Create a preview
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    try {
      setIsAnalyzing(true);
      setUploadProgress(10);
      
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = prev + 5;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 500);
      
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        try {
          const base64Image = reader.result as string;
          setUploadProgress(95);
          const analysisResult = await analyzeImage(base64Image);
          setResult(analysisResult);
          setUploadProgress(100);
          
          setTimeout(() => setUploadProgress(0), 500);
        } catch (error) {
          toast({
            title: "Analysis Failed",
            description: "Failed to analyze the image. Please try again.",
            variant: "destructive",
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "File Reading Error",
          description: "Failed to read the image file. Please try again.",
          variant: "destructive",
        });
        clearInterval(progressInterval);
        setUploadProgress(0);
      };

      return () => clearInterval(progressInterval);
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

  if (hasAccess === null) {
    return (
      <Card className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-8">
          <div className="animate-pulse text-center">
            <p className="text-muted-foreground">Checking access...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (hasAccess === false) {
    return (
      <Card className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-8">
          <div className="flex justify-center">
            <div className="bg-amber-100 p-3 rounded-full">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4 mb-2">Feature Requires Upgrade</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The Medical Image Analysis feature is available on Enterprise plans and above. 
            Upgrade your subscription to access this powerful diagnostic tool.
          </p>
          <Button onClick={() => navigate("/subscription-plans")}>
            View Subscription Options
          </Button>
        </div>
      </Card>
    );
  }

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

        {uploadProgress > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Uploading and analyzing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        )}

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
