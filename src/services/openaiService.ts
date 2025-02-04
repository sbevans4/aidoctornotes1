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
    1. Each procedure code MUST be justified by specific findings documented in the note
    2. The note MUST include all necessary components for each procedure code's documentation requirements
    3. The assessment MUST clearly link to documented findings with specific evidence
    4. The plan MUST align with both the assessment and procedure codes
    5. Include specific measurements, observations, or test results that support medical necessity
    6. Document patient history relevant to the current visit
    7. Include any pertinent review of systems
    8. Document specific physical examination findings
    
    Generate a detailed SOAP note with the following sections:
    - Subjective: Include chief complaint, detailed history of present illness, relevant past medical history, and review of systems
    - Objective: Document all physical exam findings that support the procedure codes, including specific measurements and observations
    - Assessment: List diagnoses with clear links to supporting evidence from both subjective and objective findings
    - Plan: Detail treatment plan including specific procedures referenced by the codes, with clear medical necessity justification
    
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

  // Enhanced validation checks
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

  // Check for minimum content length and key components in each section
  const minLengths = {
    subjective: 200,  // Increased minimum length requirements
    objective: 200,
    assessment: 100,
    plan: 150
  };

  // Validate section lengths
  Object.entries(minLengths).forEach(([section, minLength]) => {
    if (soapNote[section].length < minLength) {
      issues.push(`${section.charAt(0).toUpperCase() + section.slice(1)} section requires more detail to support medical necessity`);
    }
  });

  // Check for required components in Subjective section
  const subjectiveRequirements = [
    { term: "chief complaint", message: "Chief complaint must be clearly documented" },
    { term: "history of present illness", message: "History of present illness is required" },
    { term: "past medical history", message: "Past medical history should be documented" },
    { term: "review of systems", message: "Review of systems should be included" }
  ];

  subjectiveRequirements.forEach(({ term, message }) => {
    if (!soapNote.subjective.toLowerCase().includes(term)) {
      issues.push(message);
    }
  });

  // Check for required components in Objective section
  const objectiveRequirements = [
    { term: "examination", message: "Physical examination findings must be documented" },
    { term: "vital", message: "Vital signs should be documented where relevant" },
    { term: "findings", message: "Specific examination findings must be documented" }
  ];

  objectiveRequirements.forEach(({ term, message }) => {
    if (!soapNote.objective.toLowerCase().includes(term)) {
      issues.push(message);
    }
  });

  // Validate procedure code documentation
  procedureCodes.forEach(code => {
    if (code) {
      // Check if the code is mentioned in the plan
      if (!soapNote.plan.toLowerCase().includes(code.toLowerCase())) {
        issues.push(`Procedure code ${code} must be explicitly documented in the plan`);
      }
      
      // Check for supporting documentation
      const codeSupported = 
        soapNote.objective.toLowerCase().includes(code.toLowerCase()) ||
        soapNote.assessment.toLowerCase().includes(code.toLowerCase());
      
      if (!codeSupported) {
        issues.push(`Supporting documentation for procedure code ${code} must be present in objective findings or assessment`);
      }
    }
  });

  // Check assessment-plan alignment
  if (!soapNote.plan.toLowerCase().includes(soapNote.assessment.toLowerCase().substring(0, 20))) {
    issues.push("Plan must align with documented assessment findings");
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
