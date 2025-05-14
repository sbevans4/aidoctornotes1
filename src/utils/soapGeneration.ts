
import { validateSoapNote } from './soapValidation';
import { toast } from "@/hooks/use-toast";
import { TemplateOption } from '@/components/advanced-documentation/TemplateSelector';

export const generateSoapNotePrompt = (transcript: string, procedureCodes: string[], template: TemplateOption): string => {
  return `
    ${template.specialtyPrompt}
    
    Analyze the following medical conversation transcript and procedure codes to generate a compliant and accurate SOAP note.
    
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
};

export const handleSoapNoteValidation = (soapNote: any, procedureCodes: string[]) => {
  const validationIssues = validateSoapNote(soapNote, procedureCodes);
  
  validationIssues.forEach(issue => {
    toast({
      title: issue.severity === 'error' ? "Documentation Error" : "Documentation Warning",
      description: issue.message,
      variant: issue.severity === 'error' ? "destructive" : "default",
    });
  });

  return validationIssues.length === 0;
};

export const getSoapNoteTemplate = (templateId: string, templates: TemplateOption[]): TemplateOption => {
  const template = templates.find(t => t.id === templateId);
  if (!template) {
    // Default to general if template not found
    return templates.find(t => t.id === "general") || templates[0];
  }
  return template;
};
