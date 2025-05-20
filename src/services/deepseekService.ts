
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { SoapNote } from "@/hooks/useSoapNoteGeneration";
import { generateSoapNotePrompt } from "@/utils/soapGeneration";
import { templateOptions } from "@/components/advanced-documentation/TemplateSelector";

// Get the DeepSeek API key from Supabase secrets
async function getDeepseekApiKey() {
  if (!supabase) {
    throw new Error('Please connect to Supabase first using the Supabase menu in the top right corner.');
  }

  const { data, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'DEEPSEEK_API_KEY')
    .single();
  
  if (error) throw error;
  if (!data?.value) {
    toast({
      title: "DeepSeek API Key Required",
      description: "Please add your DeepSeek API key in the project settings.",
      variant: "destructive",
    });
    throw new Error('DeepSeek API key not found. Please add it in the project settings.');
  }
  return data.value;
}

// Generate a SOAP note using the DeepSeek API
export async function generateSoapNote(
  transcript: string, 
  procedureCodes: string[],
  templateId: string = "general"
): Promise<SoapNote> {
  try {
    const apiKey = await getDeepseekApiKey();
    const template = templateOptions.find(t => t.id === templateId) || templateOptions[0];
    const prompt = generateSoapNotePrompt(transcript, procedureCodes, template);

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat', // Update with the appropriate DeepSeek model
        messages: [
          {
            role: 'system',
            content: 'You are a medical documentation specialist focused on creating compliant and accurate SOAP notes that properly justify procedure codes while maintaining clinical accuracy.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    let soapNote: SoapNote;
    
    try {
      soapNote = JSON.parse(data.choices[0].message.content);
      
      // Validate that all required fields are present
      if (!soapNote.subjective || !soapNote.objective || 
          !soapNote.assessment || !soapNote.plan) {
        throw new Error('Generated SOAP note is missing required fields');
      }
    } catch (parseError) {
      console.error('Error parsing SOAP note JSON:', parseError);
      throw new Error('Failed to parse DeepSeek response');
    }

    toast({
      title: "Documentation Complete",
      description: "SOAP note generated with all required elements for the specified procedures.",
    });

    return soapNote;
  } catch (error) {
    console.error('DeepSeek API error:', error);
    toast({
      title: "Error Generating SOAP Note",
      description: error.message || "An error occurred while generating the SOAP note",
      variant: "destructive",
    });
    throw error;
  }
}
