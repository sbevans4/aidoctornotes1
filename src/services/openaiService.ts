
import { createClient } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";
import { generateSoapNotePrompt, handleSoapNoteValidation, getSoapNoteTemplate } from '@/utils/soapGeneration';
import { templateOptions } from '@/components/advanced-documentation/TemplateSelector';

// Only create the client if the environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: ReturnType<typeof createClient> | null = null;

try {
  if (!supabaseUrl || !supabaseKey) {
    toast({
      title: "Supabase Connection Required",
      description: "Please connect to Supabase using the Supabase menu in the top right corner.",
      variant: "destructive",
    });
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  toast({
    title: "Supabase Connection Error",
    description: "There was an error connecting to Supabase. Please try reconnecting.",
    variant: "destructive",
  });
}

async function getOpenAIKey() {
  if (!supabase) {
    throw new Error('Please connect to Supabase first using the Supabase menu in the top right corner.');
  }

  const { data, error } = await supabase
    .from('secrets')
    .select('value')
    .eq('name', 'OPENAI_API_KEY')
    .single();
  
  if (error) throw error;
  if (!data?.value) {
    toast({
      title: "OpenAI API Key Required",
      description: "Please add your OpenAI API key in the project settings.",
      variant: "destructive",
    });
    throw new Error('OpenAI API key not found. Please add it in the project settings.');
  }
  return data.value;
}

export async function generateSoapNote(
  transcript: string, 
  procedureCodes: string[],
  templateId: string = "general"
): Promise<{
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}> {
  const apiKey = await getOpenAIKey();
  const template = getSoapNoteTemplate(templateId, templateOptions);
  const prompt = generateSoapNotePrompt(transcript, procedureCodes, template);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
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
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate SOAP note');
  }

  const data = await response.json();
  const soapNote = JSON.parse(data.choices[0].message.content);

  const isValid = handleSoapNoteValidation(soapNote, procedureCodes);
  
  if (isValid) {
    toast({
      title: "Documentation Complete",
      description: "SOAP note generated with all required elements for the specified procedures.",
    });
  }

  return soapNote;
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const apiKey = await getOpenAIKey();
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm');
  formData.append('model', 'whisper-1');

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Transcription failed');
  }

  const data = await response.json();
  return data.text;
}

export async function analyzeImage(imageBase64: string): Promise<string> {
  const apiKey = await getOpenAIKey();

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a medical image analysis assistant. Analyze the provided medical image and provide a detailed interpretation. Focus on key findings, potential diagnoses, and any notable abnormalities.'
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Please analyze this medical image and provide interpretation:' },
            { type: 'image_url', image_url: imageBase64 }
          ]
        }
      ],
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze image');
  }

  const data = await response.json();
  return data.choices[0].message.content;
}
