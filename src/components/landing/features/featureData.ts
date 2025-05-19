
import { SubscriptionTier } from "@/hooks/useSubscription";

export interface PlanData {
  title: string;
  price: string;
  description: string;
  includesText?: string;
  popular?: boolean;
}

export interface FeatureData {
  text: string;
  tooltip: string;
  tiers: Record<string, boolean>;
}

export interface TestimonialData {
  quote: string;
  author: string;
  specialty: string;
  plan: string;
}

export const tierOrder: string[] = ['basic', 'standard', 'unlimited', 'professional', 'image_analysis', 'enterprise'];

export const plans: Record<string, PlanData> = {
  basic: { 
    title: "Basic", 
    price: "$19.99/month",
    description: "Perfect for solo practitioners getting started with AI documentation."
  },
  standard: { 
    title: "Standard", 
    price: "$149.99/month",
    description: "Everything in Basic plus unlimited notes and coding features.",
    includesText: "Everything in Basic +"
  },
  unlimited: { 
    title: "Unlimited", 
    price: "$199.99/month",
    description: "Everything in Standard plus advanced features and limited image analysis.",
    includesText: "Everything in Standard +"
  },
  professional: { 
    title: "Professional", 
    price: "$259.99/month",
    popular: true,
    description: "Everything in Unlimited plus EHR integration and team accounts.",
    includesText: "Everything in Unlimited +"
  },
  image_analysis: { 
    title: "Image Analysis", 
    price: "$499.99/month",
    description: "Everything in Professional plus unlimited image analysis for specialists.",
    includesText: "Everything in Professional +"
  },
  enterprise: { 
    title: "Enterprise", 
    price: "Contact Sales",
    description: "Custom enterprise solution with unlimited everything and dedicated support.",
    includesText: "Everything in Image Analysis +"
  }
};

export const features: Record<string, Record<string, FeatureData>> = {
  "Transcription": {
    "limited_transcription": { 
      text: "Limited transcription", 
      tooltip: "60 minutes per month", 
      tiers: {
        basic: true,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: false,
        enterprise: false
      }
    },
    "unlimited_transcription": { 
      text: "Unlimited transcription", 
      tooltip: "No monthly limits on transcription", 
      tiers: {
        basic: false,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    }
  },
  "SOAP Notes": {
    "limited_soap": { 
      text: "5 SOAP notes/month", 
      tooltip: "Limited to 5 AI-generated clinical notes per month", 
      tiers: {
        basic: true,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: false,
        enterprise: false
      }
    },
    "unlimited_soap": { 
      text: "Unlimited SOAP notes", 
      tooltip: "No monthly limits on AI-generated clinical notes", 
      tiers: {
        basic: false,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    }
  },
  "Medical Coding": {
    "code_suggestions": { 
      text: "Code suggestions", 
      tooltip: "AI-powered ICD-10 and CPT code recommendations", 
      tiers: {
        basic: false,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    },
    "code_validation": { 
      text: "Real-time code validation", 
      tooltip: "Instant validation of selected medical codes", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: true,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    },
    "searchable_db": { 
      text: "Searchable code database", 
      tooltip: "Comprehensive searchable ICD-10 and CPT code database", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    }
  },
  "EHR Integration": {
    "ehr_format": { 
      text: "EHR copy-paste format", 
      tooltip: "Notes formatted for easy copying into EHR systems", 
      tiers: {
        basic: false,
        standard: true,
        unlimited: true,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    },
    "direct_integration": { 
      text: "Direct EHR integration", 
      tooltip: "Seamless integration with Epic, Cerner, and Athenahealth", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    }
  },
  "Image Analysis": {
    "no_image": { 
      text: "No image analysis", 
      tooltip: "Image analysis feature not available", 
      tiers: {
        basic: true,
        standard: true,
        unlimited: false,
        professional: false,
        image_analysis: false,
        enterprise: false
      }
    },
    "limited_image": { 
      text: "Limited image analysis (5/month)", 
      tooltip: "Analyze up to 5 medical images per month", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: true,
        professional: true,
        image_analysis: false,
        enterprise: false
      }
    },
    "unlimited_image": { 
      text: "Unlimited image analysis", 
      tooltip: "No limits on medical image analysis", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: true,
        enterprise: true
      }
    }
  },
  "Team Access": {
    "single_user": { 
      text: "Single user", 
      tooltip: "Access for one provider account", 
      tiers: {
        basic: true,
        standard: true,
        unlimited: true,
        professional: false,
        image_analysis: false,
        enterprise: false
      }
    },
    "team_accounts": { 
      text: "Team accounts (up to 5)", 
      tooltip: "Access for up to 5 providers", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    },
    "enterprise_accounts": { 
      text: "Unlimited team accounts", 
      tooltip: "Unlimited provider accounts", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: false,
        enterprise: true
      }
    }
  },
  "Support": {
    "basic_support": { 
      text: "Basic support", 
      tooltip: "Email support with 48-hour response time", 
      tiers: {
        basic: true,
        standard: false,
        unlimited: false,
        professional: false,
        image_analysis: false,
        enterprise: false
      }
    },
    "standard_support": { 
      text: "Standard support", 
      tooltip: "Email and chat support with 24-hour response", 
      tiers: {
        basic: false,
        standard: true,
        unlimited: false,
        professional: false,
        image_analysis: false,
        enterprise: false
      }
    },
    "premium_support": { 
      text: "Premium support", 
      tooltip: "24/7 phone and chat support with 12-hour response", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: true,
        professional: false,
        image_analysis: false,
        enterprise: false
      }
    },
    "priority_support": { 
      text: "Priority support", 
      tooltip: "Dedicated account manager with priority response", 
      tiers: {
        basic: false,
        standard: false,
        unlimited: false,
        professional: true,
        image_analysis: true,
        enterprise: true
      }
    }
  }
};

export const testimonials: TestimonialData[] = [
  {
    quote: "AIDoctorNotes saves me nearly 2 hours every day on documentation. The Professional plan is worth every penny.",
    author: "Dr. Emily Chen",
    specialty: "Family Medicine",
    plan: "Professional"
  },
  {
    quote: "The image analysis feature has transformed how I document dermatological findings. Extremely accurate and time-saving.",
    author: "Dr. Michael Johnson",
    specialty: "Dermatology",
    plan: "Image Analysis"
  },
  {
    quote: "Team accounts have made our practice workflow so much more efficient. We can collaborate seamlessly.",
    author: "Dr. Sarah Williams",
    specialty: "Internal Medicine",
    plan: "Professional"
  }
];
