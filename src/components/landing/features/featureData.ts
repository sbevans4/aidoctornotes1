
// Define the order of tiers for display
export const tierOrder = ["basic", "standard", "unlimited", "professional", "image_analysis"];

// Plan details including titles, prices, and descriptions
export const plans = {
  basic: {
    title: "Basic",
    price: "$19.99",
    description: "Essential features for solo practitioners",
    includesText: ""
  },
  standard: {
    title: "Standard",
    price: "$149.99",
    description: "Comprehensive solution for growing practices",
    includesText: "Everything in Basic +"
  },
  unlimited: {
    title: "Unlimited",
    price: "$199.99",
    description: "Advanced features for established practices",
    includesText: "Everything in Standard +"
  },
  professional: {
    title: "Professional",
    price: "$259.99",
    description: "Complete solution for medical teams",
    includesText: "Everything in Unlimited +",
    popular: true
  },
  image_analysis: {
    title: "Image Analysis",
    price: "$499.99",
    description: "Specialized diagnostics with image analysis",
    includesText: "Everything in Professional +"
  }
};

// Features organized by category and tier availability
export const features = {
  "Transcription & Documentation": {
    unlimited_transcription: {
      text: "Unlimited Transcription",
      tooltip: "Convert unlimited audio to text without monthly limits",
      tiers: {
        basic: true,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    },
    soap_notes_limit: {
      text: "SOAP Notes",
      tooltip: "Generate structured clinical documentation",
      tiers: {
        basic: true,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    },
    soap_notes_monthly: {
      text: "5 SOAP Notes/Month",
      tooltip: "Limited to 5 SOAP notes per month",
      tiers: {
        basic: true,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: false
      }
    },
    unlimited_soap_notes: {
      text: "Unlimited SOAP Notes",
      tooltip: "Generate as many SOAP notes as you need",
      tiers: {
        basic: false,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    },
    pdf_export: {
      text: "PDF Export",
      tooltip: "Export documentation in PDF format",
      tiers: {
        basic: true,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    }
  },
  "Clinical Support": {
    code_suggestions: {
      text: "Code Suggestions",
      tooltip: "Get suggestions for ICD-10 and CPT codes",
      tiers: {
        basic: false,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    },
    code_validation: {
      text: "Real-time Code Validation",
      tooltip: "Validate codes in real-time for billing accuracy",
      tiers: {
        basic: false,
        standard: false,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    },
    code_database: {
      text: "Comprehensive Code Database",
      tooltip: "Access to complete database of medical codes",
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: true,
        image_analysis: true
      }
    },
    custom_templates: {
      text: "Custom Templates",
      tooltip: "Create and save custom documentation templates",
      tiers: {
        basic: false,
        standard: false,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    }
  },
  "Image Analysis": {
    image_scans: {
      text: "5 Image Analysis Scans/Month",
      tooltip: "Analyze up to 5 medical images per month",
      tiers: {
        basic: false,
        standard: false,
        unlimited: true,
        professional: true,
        image_analysis: false
      }
    },
    unlimited_image_analysis: {
      text: "Unlimited Image Analysis",
      tooltip: "Analyze unlimited medical images with AI assistance",
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: true
      }
    },
    real_time_interpretation: {
      text: "Real-time Image Interpretation",
      tooltip: "Get immediate analysis of medical images",
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: true
      }
    },
    diagnostic_suggestions: {
      text: "Diagnostic Suggestions",
      tooltip: "Receive AI-powered diagnostic suggestions from images",
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: true
      }
    }
  },
  "EHR Integration": {
    ehr_copy_paste: {
      text: "EHR Copy-Paste",
      tooltip: "Easily copy documentation to your EHR system",
      tiers: {
        basic: false,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    },
    ehr_integration: {
      text: "Direct EHR Integration",
      tooltip: "Seamlessly integrate with major EHR systems",
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: true,
        image_analysis: true
      }
    },
    image_enhanced_notes: {
      text: "Image-Enhanced Documentation",
      tooltip: "Include analyzed images directly in your notes",
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: true
      }
    }
  },
  "Team & Support": {
    basic_support: {
      text: "Basic Support",
      tooltip: "Email support with 24-hour response time",
      tiers: {
        basic: true,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: false
      }
    },
    standard_support: {
      text: "Standard Support",
      tooltip: "Email and chat support with same-day response",
      tiers: {
        basic: false,
        standard: true,
        unlimited: false,
        professional: false,
        image_analysis: false
      }
    },
    priority_support: {
      text: "24/7 Priority Support",
      tooltip: "24/7 priority support via email, chat, and phone",
      tiers: {
        basic: false,
        standard: false,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    },
    team_accounts: {
      text: "Team Accounts (5 Users)",
      tooltip: "Add up to 5 users to your account",
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: true,
        image_analysis: true
      }
    },
    specialist_templates: {
      text: "Specialist Templates",
      tooltip: "Access templates for various medical specialties",
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: true
      }
    }
  },
  "Analytics & Reporting": {
    usage_alerts: {
      text: "Usage Alerts",
      tooltip: "Receive alerts about your usage limits",
      tiers: {
        basic: true,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    },
    basic_analytics: {
      text: "Basic Analytics",
      tooltip: "View basic usage statistics and reports",
      tiers: {
        basic: false,
        standard: true,
        unlimited: false,
        professional: false,
        image_analysis: false
      }
    },
    advanced_analytics: {
      text: "Advanced Analytics",
      tooltip: "Comprehensive practice analytics and insights",
      tiers: {
        basic: false,
        standard: false,
        unlimited: true,
        professional: true,
        image_analysis: true
      }
    }
  }
};

// Testimonials for social proof
export const testimonials = [
  {
    quote: "AIDoctorNotes has saved me at least 2 hours every day on documentation. The automatic SOAP note generation is incredibly accurate.",
    author: "Dr. Sarah Johnson",
    specialty: "Family Medicine",
    plan: "Professional"
  },
  {
    quote: "The image analysis feature has transformed how I document findings from radiological images. It's like having an AI assistant right there with me.",
    author: "Dr. Michael Chen",
    specialty: "Radiology",
    plan: "Image Analysis"
  },
  {
    quote: "I was skeptical at first, but now I can't imagine practicing without AIDoctorNotes. The unlimited transcription alone is worth the subscription.",
    author: "Dr. Rebecca Torres",
    specialty: "Internal Medicine",
    plan: "Unlimited"
  }
];

// Types for TypeScript
export interface FeatureData {
  text: string;
  tooltip: string;
  tiers: Record<string, boolean>;
}
