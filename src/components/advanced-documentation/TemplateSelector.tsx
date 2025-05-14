
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from "@/components/ui/card";
import { 
  FileText, 
  Stethoscope, 
  Brain, 
  HeartPulse, 
  Bone, 
  Baby,
  Microscope,
  Eye,
  BookOpen
} from "lucide-react";

export interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  specialtyPrompt: string;
}

interface TemplateSelectorProps {
  selectedTemplateId: string;
  onChange: (templateId: string) => void;
}

export const templateOptions: TemplateOption[] = [
  {
    id: "general",
    name: "General Medical",
    description: "Standard SOAP template for general medical encounters",
    icon: Stethoscope,
    specialtyPrompt: "You are a general medical practitioner. Generate a comprehensive SOAP note that follows standard medical documentation practices."
  },
  {
    id: "psychiatric",
    name: "Psychiatric",
    description: "Mental health focused with behavioral assessments",
    icon: Brain,
    specialtyPrompt: "You are a psychiatrist. Generate a SOAP note focusing on mental status examination, behavioral observations, mood assessment, and psychiatric treatment planning."
  },
  {
    id: "cardiology",
    name: "Cardiology",
    description: "Heart-focused with EKG and cardiac metrics",
    icon: HeartPulse,
    specialtyPrompt: "You are a cardiologist. Generate a SOAP note focused on cardiovascular assessment, with specific details on heart rhythm, blood pressure, cardiac enzyme levels if relevant, and cardiac-specific treatment protocols."
  },
  {
    id: "orthopedic",
    name: "Orthopedic",
    description: "Musculoskeletal focus with mobility assessments",
    icon: Bone,
    specialtyPrompt: "You are an orthopedic specialist. Generate a SOAP note focusing on musculoskeletal examination, range of motion assessments, and orthopedic-specific treatment planning."
  },
  {
    id: "pediatric",
    name: "Pediatric",
    description: "Child development and growth focused",
    icon: Baby,
    specialtyPrompt: "You are a pediatrician. Generate an age-appropriate SOAP note focusing on developmental milestones, growth metrics, and pediatric-specific assessments and treatments."
  },
  {
    id: "pathology",
    name: "Pathology",
    description: "Detailed analysis of lab and specimen results",
    icon: Microscope,
    specialtyPrompt: "You are a pathologist. Generate a SOAP note focusing on laboratory findings, specimen analysis, and diagnostic interpretations with pathological significance."
  },
  {
    id: "ophthalmology",
    name: "Ophthalmology",
    description: "Eye examination and vision assessment",
    icon: Eye,
    specialtyPrompt: "You are an ophthalmologist. Generate a SOAP note focusing on visual acuity, eye examination findings, and ophthalmological treatment planning."
  },
  {
    id: "educational",
    name: "Educational",
    description: "Detailed for teaching and learning purposes",
    icon: BookOpen,
    specialtyPrompt: "You are creating an educational SOAP note. Generate a comprehensive note with additional explanations of medical reasoning, differential diagnoses considerations, and references to clinical guidelines where relevant."
  }
];

const TemplateSelector = ({ selectedTemplateId, onChange }: TemplateSelectorProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Select Documentation Template</CardTitle>
        <CardDescription>
          Choose a specialty-specific template to enhance your documentation
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedTemplateId} 
          onValueChange={onChange}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {templateOptions.map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.id} className="relative">
                <RadioGroupItem 
                  value={template.id} 
                  id={template.id} 
                  className="peer sr-only" 
                />
                <Label 
                  htmlFor={template.id}
                  className="flex flex-col items-center gap-2 rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                >
                  <Icon className="mb-2 h-6 w-6" />
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-center text-muted-foreground">{template.description}</div>
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
