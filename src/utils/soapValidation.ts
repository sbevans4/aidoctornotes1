interface ValidationIssue {
  section: string;
  message: string;
  severity: 'warning' | 'error';
}

export const validateSoapNote = (soapNote: any, procedureCodes: string[]): ValidationIssue[] => {
  const issues: ValidationIssue[] = [];

  // Minimum content length requirements for each section
  const minLengths = {
    subjective: 200,
    objective: 200,
    assessment: 100,
    plan: 150
  };

  // Validate section lengths
  Object.entries(minLengths).forEach(([section, minLength]) => {
    if (soapNote[section].length < minLength) {
      issues.push({
        section,
        message: `${section.charAt(0).toUpperCase() + section.slice(1)} section requires more detail to support medical necessity`,
        severity: 'error'
      });
    }
  });

  // Required components for each section
  const requiredComponents = {
    subjective: [
      { term: "chief complaint", message: "Chief complaint must be clearly documented" },
      { term: "history of present illness", message: "History of present illness is required" },
      { term: "past medical history", message: "Past medical history should be documented" },
      { term: "review of systems", message: "Review of systems should be included" }
    ],
    objective: [
      { term: "examination", message: "Physical examination findings must be documented" },
      { term: "vital", message: "Vital signs should be documented where relevant" },
      { term: "findings", message: "Specific examination findings must be documented" }
    ]
  };

  // Check required components
  Object.entries(requiredComponents).forEach(([section, components]) => {
    components.forEach(({ term, message }) => {
      if (!soapNote[section].toLowerCase().includes(term)) {
        issues.push({
          section,
          message,
          severity: 'warning'
        });
      }
    });
  });

  // Validate procedure code documentation
  procedureCodes.forEach(code => {
    if (code) {
      if (!soapNote.plan.toLowerCase().includes(code.toLowerCase())) {
        issues.push({
          section: 'plan',
          message: `Procedure code ${code} must be explicitly documented in the plan`,
          severity: 'error'
        });
      }

      const codeSupported = 
        soapNote.objective.toLowerCase().includes(code.toLowerCase()) ||
        soapNote.assessment.toLowerCase().includes(code.toLowerCase());
      
      if (!codeSupported) {
        issues.push({
          section: 'documentation',
          message: `Supporting documentation for procedure code ${code} must be present in objective findings or assessment`,
          severity: 'error'
        });
      }
    }
  });

  // Check assessment-plan alignment
  if (!soapNote.plan.toLowerCase().includes(soapNote.assessment.toLowerCase().substring(0, 20))) {
    issues.push({
      section: 'alignment',
      message: "Plan must align with documented assessment findings",
      severity: 'warning'
    });
  }

  return issues;
};