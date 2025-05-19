
export function getPreviousTier(tier: string): string {
  switch(tier) {
    case 'standard': return 'Basic';
    case 'unlimited': return 'Standard';
    case 'professional': return 'Unlimited';
    case 'image_analysis': return 'Professional';
    default: return '';
  }
}

export const planHighlights = {
  basic: {
    title: "Basic",
    subtitle: "For getting started",
    includedFeatures: [
      "Limited transcription (60 min/month)",
      "5 SOAP notes per month",
      "PDF export",
      "Basic email support"
    ]
  },
  standard: {
    title: "Standard",
    subtitle: "Most affordable",
    includedFeatures: [
      "Everything in Basic +",
      "Unlimited transcription",
      "Unlimited SOAP notes",
      "Code suggestions",
      "EHR copy-paste format"
    ]
  },
  unlimited: {
    title: "Unlimited",
    subtitle: "For power users",
    includedFeatures: [
      "Everything in Standard +",
      "Real-time code validation",
      "Custom templates",
      "Limited image analysis (5/month)",
      "24/7 premium support"
    ]
  },
  professional: {
    title: "Professional",
    subtitle: "Most popular plan",
    includedFeatures: [
      "Everything in Unlimited +",
      "Direct EHR integration",
      "Team accounts (up to 5)",
      "Searchable code database",
      "Priority processing"
    ]
  },
  image_analysis: {
    title: "Image Analysis",
    subtitle: "For specialists",
    includedFeatures: [
      "Everything in Professional +",
      "Unlimited image analysis",
      "Real-time image interpretation",
      "Diagnostic suggestions",
      "Specialist templates"
    ]
  }
};

export const socialProofNumbers = {
  doctors: "5,000+",
  notes: "1 million+",
  saved: "2 hours",
  satisfaction: "98%"
};
