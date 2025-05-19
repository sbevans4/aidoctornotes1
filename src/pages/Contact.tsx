
import ContactForm from "@/components/contact/ContactForm";
import { ContactInfoSection } from "@/components/contact/ContactInfoSection";
import { Helmet } from "react-helmet";
import { MobileResponsiveWrapper } from "@/components/layout/MobileResponsiveWrapper";

const Contact = () => {
  return (
    <MobileResponsiveWrapper>
      <div className="py-12">
        <Helmet>
          <title>Contact Us | AiDoctorNotes</title>
          <meta 
            name="description" 
            content="Contact the AiDoctorNotes team for support, demos, pricing information or partnership inquiries."
          />
        </Helmet>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about AiDoctorNotes? Our team is here to help you with any inquiries about our AI-powered medical documentation solutions.
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 gap-8 sm:gap-12">
            <div className="lg:col-span-2">
              <ContactInfoSection />
            </div>
            
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </MobileResponsiveWrapper>
  );
};

export default Contact;
