
import React from "react";
import { Helmet } from "react-helmet";
import { Shield, Lock, Check, FileCheck, Server, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Security = () => {
  const navigate = useNavigate();

  const securityFeatures = [
    {
      title: "HIPAA Compliance",
      description: "Our platform is built from the ground up to meet or exceed all HIPAA Security and Privacy Rule requirements.",
      icon: Shield
    },
    {
      title: "End-to-End Encryption",
      description: "All data in transit and at rest is protected with AES-256 encryption, ensuring your information remains secure.",
      icon: Lock
    },
    {
      title: "Role-Based Access",
      description: "Granular access controls ensure that users can only access the data they need for their specific roles.",
      icon: FileCheck
    },
    {
      title: "SOC 2 Type II Certified",
      description: "Our infrastructure and processes have been audited and certified to meet SOC 2 Type II standards.",
      icon: Server
    }
  ];

  return (
    <>
      <Helmet>
        <title>Security & Compliance | ConvoNotes Genius</title>
        <meta name="description" content="HIPAA-compliant security measures and data protection protocols for healthcare documentation. Learn how we safeguard your patient information." />
        <meta property="og:title" content="Security & Compliance | ConvoNotes Genius" />
        <meta property="og:description" content="HIPAA-compliant security measures and data protection protocols for healthcare documentation." />
      </Helmet>

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Shield className="h-16 w-16 mx-auto mb-6" />
              <h1 className="text-4xl font-bold mb-4">Security & Compliance</h1>
              <p className="text-xl mb-8">
                We protect your data with the same care that you protect your patients. 
                Our robust security infrastructure ensures HIPAA compliance and the highest standards of data protection.
              </p>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => navigate("/contact")}
              >
                Contact Our Security Team
              </Button>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Enterprise-Grade Security</h2>

            <div className="grid md:grid-cols-2 gap-8">
              {securityFeatures.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex">
                  <div className="mr-4 bg-blue-50 p-3 rounded-lg h-fit">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HIPAA Compliance */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">HIPAA Compliance</h2>
                <p className="text-lg text-gray-600">
                  ConvoNotes Genius is designed to meet all requirements of the Health Insurance Portability and Accountability Act (HIPAA).
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-bold mb-6">Our HIPAA Compliance Framework</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Business Associate Agreement</h4>
                      <p className="text-gray-600">We provide a BAA for all customers, outlining our responsibilities for safeguarding PHI.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Security Risk Assessment</h4>
                      <p className="text-gray-600">Regular comprehensive risk analyses to identify and mitigate potential vulnerabilities.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Access Controls & Audit Trails</h4>
                      <p className="text-gray-600">Detailed tracking of all system access and data interactions with comprehensive audit logs.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Data Encryption</h4>
                      <p className="text-gray-600">All patient data is encrypted both in transit and at rest using industry-leading encryption standards.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Check className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold">Emergency Access Procedures</h4>
                      <p className="text-gray-600">Contingency plans to ensure PHI availability during emergencies while maintaining security.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Our Certifications</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                ConvoNotes Genius maintains rigorous compliance with industry standards and regulations.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-center">HIPAA Compliant</h3>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-center">SOC 2 Type II</h3>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-center">ISO 27001</h3>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Award className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-center">GDPR Compliant</h3>
              </div>
            </div>
          </div>
        </section>

        {/* Security Whitepaper CTA */}
        <section className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Download Our Security Whitepaper</h2>
              <p className="text-xl mb-8">
                Get detailed information about our security practices, infrastructure, and compliance measures.
              </p>
              <Button className="bg-white text-blue-600 hover:bg-gray-100">
                Download Whitepaper
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Security;
