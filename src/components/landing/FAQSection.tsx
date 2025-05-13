
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const FAQSection = () => {
  const navigate = useNavigate();
  
  const faqs = [
    {
      question: "Is ConvoNotes Genius HIPAA-compliant?",
      answer: "Yes, our platform is fully HIPAA-compliant with end-to-end encryption, secure data storage, and Business Associate Agreements available for all customers. We undergo regular security audits and maintain strict access controls to protect patient information."
    },
    {
      question: "How accurate is the AI transcription?",
      answer: "Our medical-grade AI achieves over 98% accuracy for most medical specialties. The system is trained on millions of healthcare conversations and continually improves. For specialty-specific terminology, we offer custom training to further enhance accuracy."
    },
    {
      question: "How does the EHR integration work?",
      answer: "We offer direct integrations with major EHR systems like Epic, Cerner, Allscripts, and NextGen through their APIs. For other systems, we provide secure export options or can build custom integrations. Setup typically takes less than an hour with our integration team's assistance."
    },
    {
      question: "Can I use the system offline?",
      answer: "Yes, our mobile app includes offline recording capabilities that will sync and process your recordings once you're back online. This ensures you can document patient encounters even in areas with limited connectivity."
    },
    {
      question: "How much time can I expect to save?",
      answer: "Our users report saving an average of 1-2 hours daily on documentation. This varies by specialty and previous documentation methods, but most physicians see significant time savings within the first week of use."
    },
    {
      question: "Do you offer a Business Associate Agreement (BAA)?",
      answer: "Yes, we provide a standard BAA for all paying customers as part of our commitment to HIPAA compliance. Our BAA clearly outlines our responsibilities as a business associate and can be signed during the onboarding process."
    },
  ];
  
  return (
    <section className="py-16" id="faq">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about our AI-powered medical documentation solution
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-gray-600">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        
        <div className="mt-12 bg-gray-100 rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex items-center gap-2 p-2 bg-white rounded-full">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="font-semibold pr-1">HIPAA-Compliant</span>
            </div>
            <p className="text-center sm:text-left text-gray-700">
              Our platform is fully HIPAA-compliant with BAAs available for all customers.
            </p>
            <Button 
              className="whitespace-nowrap ml-auto"
              onClick={() => navigate("/security")}
              variant="outline"
            >
              Security Details
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Have more questions?</p>
          <Button onClick={() => navigate("/contact")}>Contact Our Support Team</Button>
        </div>
      </div>
    </section>
  );
};
