
import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection: React.FC = () => {
  const faqs = [
    { 
      question: "How does Therapy Notes ensure HIPAA compliance?", 
      answer: "All data is encrypted end-to-end, patient identifiers are automatically redacted, and session data is deleted after processing. We maintain strict access controls, regular security audits, and comply with all HIPAA requirements for Business Associate Agreements (BAA)."
    },
    { 
      question: "Can I customize therapy note templates?", 
      answer: "Yes, custom templates are available in Unlimited and higher plans. You can create specialized templates for different therapy types including CBT, DBT, family therapy, and more. Templates can be saved, shared among team members, and modified to fit your specific practice needs."
    },
    { 
      question: "What billing codes are supported?", 
      answer: "Our system supports the full range of mental health ICD-10 and CPT codes with real-time validation in Unlimited and higher plans. The AI will automatically suggest relevant codes based on your documentation, significantly reducing billing errors and claim rejections."
    },
    { 
      question: "How accurate is the AI transcription for therapy sessions?", 
      answer: "Our specialized AI model achieves over 98% accuracy for mental health terminology and concepts. It's been trained on thousands of therapy sessions to recognize therapy-specific language, therapeutic interventions, and clinical terminology used in mental health practice."
    },
    { 
      question: "Can I integrate with my existing EHR system?", 
      answer: "Yes, Professional and higher plans include EHR integration capabilities. We support direct integration with major EHR systems including TherapyNotes, SimplePractice, and TheraNest. For other systems, we provide secure export options in multiple formats."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg p-2 shadow-sm">
                <AccordionTrigger className="text-left font-medium px-2">{faq.question}</AccordionTrigger>
                <AccordionContent className="px-4 pt-2 pb-4 text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};
