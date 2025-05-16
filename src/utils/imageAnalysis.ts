
import { toast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/types/analysis";
import { useSubscription } from "@/hooks/useSubscription";

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
  try {
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
            content: `You are a medical image analysis assistant specialized in analyzing medical images and providing clinical insights. 
            Analyze the provided medical image and return a JSON response with these fields:
            - interpretation: A detailed medical interpretation of the image with observations, possible diagnoses, and clinical insights.
            - suggestedCodes: An array of relevant medical diagnostic or billing codes (ICD-10, CPT).
            - diagnosisConfidence: A number between 0 and 1 representing your confidence in the primary diagnosis.
            - findings: An array of objects, each containing: name (brief name of the finding), probability (a number between 0 and 1), and description (detailed explanation of the finding).
            Only respond with valid JSON. Don't include any explanatory text outside the JSON structure.`
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Please analyze this medical image:" },
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
    // Parse the GPT response as JSON - it should be already structured as requested
    let parsedResult;
    try {
      const jsonContent = data.choices[0].message.content;
      parsedResult = JSON.parse(jsonContent);
      
      // Create a properly formatted AnalysisResult object
      const result: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'image',
        content: {
          url: base64Image,
        },
        analysis: {
          summary: parsedResult.interpretation,
          confidence: parsedResult.diagnosisConfidence || 0,
        },
        interpretation: parsedResult.interpretation,
        findings: parsedResult.findings || [],
        suggestedCodes: parsedResult.suggestedCodes || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      return result;
    } catch (e) {
      // If JSON parsing fails, use the raw text as interpretation
      const fallbackResult: AnalysisResult = {
        id: crypto.randomUUID(),
        type: 'image',
        content: {
          url: base64Image,
        },
        analysis: {
          summary: data.choices[0].message.content,
        },
        interpretation: data.choices[0].message.content,
        suggestedCodes: [],
        findings: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      return fallbackResult;
    }
  } catch (error) {
    console.error('Error analyzing image:', error);
    toast({
      title: "Analysis Failed",
      description: "Failed to analyze the image. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};

export const validateImageFile = (file: File): boolean => {
  if (!file.type.startsWith('image/')) {
    toast({
      title: "Invalid file type",
      description: "Please upload an image file",
      variant: "destructive",
    });
    return false;
  }
  
  // Check file size - limit to 10MB
  const maxSize = 10 * 1024 * 1024; // 10MB in bytes
  if (file.size > maxSize) {
    toast({
      title: "File too large",
      description: "Please upload an image smaller than 10MB",
      variant: "destructive",
    });
    return false;
  }
  
  return true;
};

export const checkImageAnalysisAccess = async (): Promise<boolean> => {
  try {
    // Check if the user has access to the image analysis feature
    const { checkFeatureAccess } = useSubscription();
    return await checkFeatureAccess("image_analysis");
  } catch (error) {
    console.error("Error checking image analysis access:", error);
    return false;
  }
};
