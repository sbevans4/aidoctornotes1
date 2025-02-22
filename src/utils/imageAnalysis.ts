
import { toast } from "@/hooks/use-toast";
import { AnalysisResult } from "@/types/analysis";

export const analyzeImage = async (base64Image: string): Promise<AnalysisResult> => {
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
  return {
    interpretation: data.choices[0].message.content,
    suggestedCodes: [], // We could add ICD/CPT code suggestions here
  };
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
  return true;
};

