
import React from "react";
import { Helmet } from "react-helmet";
import MedicalDocumentationForm from "@/components/MedicalDocumentationForm";

const MedicalDocumentation = () => {
  return (
    <>
      <Helmet>
        <title>Medical Documentation | AIDoctorNotes</title>
        <meta name="description" content="Generate accurate SOAP notes from your medical conversations" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-center md:text-left">Medical Documentation</h1>
        <p className="text-gray-600 mb-8 text-center md:text-left max-w-2xl">
          Record your conversations and automatically generate structured SOAP notes ready to import into your EHR system.
        </p>
        
        <MedicalDocumentationForm />
      </div>
    </>
  );
};

export default MedicalDocumentation;
