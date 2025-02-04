import { createClient } from '@supabase/supabase-js';
import { toast } from "@/hooks/use-toast";

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

export async function generateSoapNote(transcript: string, procedureCodes: string[]): Promise<{
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}> {
  const apiKey = await getOpenAIKey();
  
  const prompt = `
    As a medical documentation expert, analyze the following medical conversation transcript and procedure codes to generate a compliant and accurate SOAP note.
    
    Transcript: ${transcript}
    Procedure Codes: ${procedureCodes.join(', ')}
    
    Requirements for compliance:
    1. Each procedure code must be justified by specific findings in the note
    2. The note must include all necessary components for each procedure code
    3. The assessment must clearly link to the documented findings
    4. The plan must align with both the assessment and procedure codes
    
    Generate a detailed SOAP note with the following sections:
    - Subjective: Include chief complaint, history of present illness, and relevant past medical history
    - Objective: Document all physical exam findings that support the procedure codes
    - Assessment: List diagnoses with clear links to supporting evidence
    - Plan: Detail treatment plan including specific procedures referenced by the codes
    
    Ensure each section contains sufficient detail to support medical necessity for the procedures.
    Format the response as JSON with these exact keys: subjective, objective, assessment, plan
  `;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
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

  // Validate SOAP note components
  const validationIssues = validateSoapNote(soapNote, procedureCodes);
  
  if (validationIssues.length > 0) {
    validationIssues.forEach(issue => {
      toast({
        title: "Documentation Alert",
        description: issue,
        variant: "destructive",
      });
    });
  } else {
    toast({
      title: "Documentation Complete",
      description: "SOAP note generated with all required elements for the specified procedures.",
    });
  }

  return soapNote;
}

function validateSoapNote(soapNote: any, procedureCodes: string[]): string[] {
  const issues: string[] = [];

  // Check for minimum content length in each section
  if (soapNote.subjective.length < 50) {
    issues.push("Subjective section may need more detail to support medical necessity");
  }
  if (soapNote.objective.length < 50) {
    issues.push("Objective section requires more specific findings to support procedures");
  }
  if (soapNote.assessment.length < 30) {
    issues.push("Assessment section needs clearer diagnosis documentation");
  }
  if (soapNote.plan.length < 30) {
    issues.push("Plan section requires more detailed procedure documentation");
  }

  // Check for procedure code mentions in relevant sections
  procedureCodes.forEach(code => {
    if (code && !soapNote.plan.toLowerCase().includes(code.toLowerCase())) {
      issues.push(`Procedure code ${code} is not clearly documented in the plan`);
    }
  });

  // Check for key medical documentation components
  if (!soapNote.subjective.toLowerCase().includes("chief complaint")) {
    issues.push("Chief complaint should be clearly documented in subjective section");
  }

  if (!soapNote.objective.toLowerCase().includes("exam")) {
    issues.push("Physical examination findings should be documented in objective section");
  }

  return issues;
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
