
import { supabase } from "@/integrations/supabase/client";

export interface AnalysisResult {
  type: string;
  findings: string;
  confidence: number;
}

export const analyzeImage = async (
  imageFile: File,
  noteId?: string
): Promise<AnalysisResult> => {
  try {
    // Convert image to base64
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
    const imageBase64 = await imageBase64Promise;
    
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
    
    return data as AnalysisResult;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
