
export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  type: string;
}

// AI Notes Plans
export const aiNotesPlansMock: Plan[] = [
  {
    id: "ai-notes-trial",
    name: "Trial",
    price: 0,
    features: [
      "14-day free access",
      "Basic AI note generation",
      "5 notes per month",
      "Standard templates",
    ],
    type: "ai-notes",
  },
  {
    id: "ai-notes-standard",
    name: "Pro",
    price: 29.99,
    features: [
      "Unlimited AI note generation",
      "All medical specialties",
      "Custom templates",
      "Priority processing",
      "Premium support",
    ],
    type: "ai-notes",
  },
  {
    id: "ai-notes-premium",
    name: "Enterprise",
    price: 99.99,
    features: [
      "All Pro features",
      "Team accounts",
      "Advanced analytics",
      "API access",
      "Dedicated account manager",
      "Custom integrations",
    ],
    type: "ai-notes",
  },
];

// Therapy Notes Plans
export const therapyNotesPlansMock: Plan[] = [
  {
    id: "therapy-notes-trial",
    name: "Trial",
    price: 0,
    features: [
      "14-day free access",
      "Basic therapy notes",
      "5 sessions per month",
      "Standard therapy templates",
      "Basic progress tracking"
    ],
    type: "therapy-notes",
  },
  {
    id: "therapy-notes-professional",
    name: "Professional",
    price: 39.99,
    features: [
      "Unlimited sessions",
      "Specialized therapy templates (CBT, DBT, etc.)",
      "Treatment plan generator",
      "Client progress visualization",
      "Insurance-ready documentation",
      "HIPAA compliant storage"
    ],
    type: "therapy-notes",
  },
  {
    id: "therapy-notes-group",
    name: "Group Practice",
    price: 119.99,
    features: [
      "All Professional features",
      "Multiple therapist accounts",
      "Practice management tools",
      "Client portal access",
      "Supervision notes",
      "Advanced analytics dashboard",
      "Customizable assessment tools"
    ],
    type: "therapy-notes",
  },
];

// Transcription Plans
export const transcriptionPlansMock: Plan[] = [
  {
    id: "transcription-basic",
    name: "Basic",
    price: 19.99,
    features: [
      "100 minutes/month",
      "Standard accuracy",
      "24-hour turnaround",
      "Basic speaker identification",
    ],
    type: "transcription",
  },
  {
    id: "transcription-pro",
    name: "Pro",
    price: 49.99,
    features: [
      "500 minutes/month",
      "Enhanced accuracy",
      "4-hour turnaround",
      "Advanced speaker identification",
      "Medical terminology support",
      "Custom vocabulary",
    ],
    type: "transcription",
  },
  {
    id: "transcription-unlimited",
    name: "Unlimited",
    price: 99.99,
    features: [
      "Unlimited minutes",
      "Highest accuracy",
      "1-hour turnaround",
      "Priority processing",
      "Full medical terminology support",
      "Custom templates",
      "API access",
    ],
    type: "transcription",
  },
];
