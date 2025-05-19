
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/types/analysis";

export interface ImageAnalysisResult {
  type: string;
  findings: string;
  confidence: number;
}

export const validateImageFile = (file: File): boolean => {
  // Check file type
  const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (!validImageTypes.includes(file.type)) {
    toast({
      title: "Invalid File Type",
      description: "Please upload a valid image file (JPEG, PNG, GIF, WEBP)",
      variant: "destructive",
    });
    return false;
  }
  
  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    toast({
      title: "File Too Large",
      description: "Image file must be less than 10MB",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

export const checkImageAnalysisAccess = async (): Promise<boolean> => {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return false;
    }
    
    // Call the RPC function with both required parameters
    const { data, error } = await supabase.rpc('has_feature', { 
      user_id: user.id,
      feature_name: 'image_analysis'
    });
    
    if (error) {
      console.error("Error checking image analysis access:", error);
      return false;
    }
    
    return !!data; // Convert to boolean
  } catch (error) {
    console.error("Error checking image analysis access:", error);
    return false;
  }
};

export const analyzeImage = async (
  imageFile: File | string,
  noteId?: string
): Promise<AnalysisResult> => {
  try {
    let imageBase64: string;
    
    // Handle both File objects and base64 strings
    if (typeof imageFile === 'string') {
      // If it's already a base64 string, use it directly
      imageBase64 = imageFile.includes('base64,') 
        ? imageFile.split(',')[1] 
        : imageFile;
    } else {
      // Convert File to base64
      const reader = new FileReader();
      const imageBase64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const base64 = reader.result?.toString().split(',')[1];
          if (base64) {
            resolve(base64);
          } else {
            reject(new Error('Failed to convert image to base64'));
          }
        };
        reader.onerror = () => reject(reader.error);
      });
      
      reader.readAsDataURL(imageFile);
      imageBase64 = await imageBase64Promise;
    }
    
    // Call the image analysis API
    const { data, error } = await supabase.functions.invoke("analyze-image", {
      body: { 
        imageBase64,
        noteId 
      },
      method: "POST",
    });
    
    if (error) {
      if (error.message.includes('Feature not available')) {
        throw new Error('Image analysis requires a premium subscription. Please upgrade your plan to use this feature.');
      }
      console.error("Error analyzing image:", error);
      throw error;
    }
    
    if (!data) {
      throw new Error("No analysis data returned");
    }
    
    // Create a properly formatted AnalysisResult from the Edge Function response
    const result: AnalysisResult = {
      id: data.id || crypto.randomUUID(),
      type: 'image',
      content: {
        url: data.url || '',
        data: data
      },
      analysis: {
        summary: data.findings || '',
        confidence: data.confidence || 0,
      },
      interpretation: data.type || 'Unknown image type',
      findings: data.detailedFindings ? data.detailedFindings.map((f: any) => ({
        name: f.name || 'Unknown finding',
        probability: f.probability || f.confidence || 0.5,
        description: f.description || ''
      })) : [],
      suggestedCodes: data.suggestedCodes || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return result;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
