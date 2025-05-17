
import React from "react";
import { Helmet } from "react-helmet";
import { ContactInfoSection } from "@/components/contact/ContactInfoSection";
import { ContactForm } from "@/components/contact/ContactForm";

const Contact = () => {
  return (
    <>
      <Helmet>
        <title>Contact Us | AIDoctorNotes</title>
        <meta name="description" content="Get in touch with our team for questions about AI medical documentation, pricing, demo requests, or technical support." />
        <meta property="og:title" content="Contact Us | AIDoctorNotes" />
        <meta property="og:description" content="Get in touch with our team for questions about AI medical documentation, pricing, demo requests, or technical support." />
      </Helmet>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions about our AI documentation solutions? Our team is here to help.
              </p>
            </div>

            <ContactInfoSection />
            <ContactForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
