import { createClient } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

// Only create the client if the environment variables are available
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  toast({
    title: "Supabase Connection Required",
    description: "Please connect to Supabase using the Supabase menu in the top right corner.",
    variant: "destructive",
  });
}

const supabase = createClient(supabaseUrl || '', supabaseKey || '');

async function getOpenAIKey() {
  if (!supabaseUrl || !supabaseKey) {
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

export async function generateSoapNote(transcript: string, procedureCodes: string[]): Promise<{
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}> {
  const apiKey = await getOpenAIKey();
  
  const prompt = `
    Based on the following medical conversation transcript and procedure codes, generate a detailed SOAP note.
    
    Transcript: ${transcript}
    Procedure Codes: ${procedureCodes.join(', ')}
    
    Generate a detailed SOAP note with the following sections:
    - Subjective (patient's symptoms and history)
    - Objective (clinical findings)
    - Assessment (diagnosis)
    - Plan (treatment plan)
    
    Format the response as JSON with these exact keys: subjective, objective, assessment, plan
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a medical professional assistant that creates detailed SOAP notes based on conversations and procedure codes.'
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
  return JSON.parse(data.choices[0].message.content);
}