
import React from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, Server, FileCheck, FileText, CheckCircle } from "lucide-react";

const Security = () => {
  const securityFeatures = [
    {
      icon: Lock,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using industry-standard AES-256 encryption, ensuring patient information remains secure."
    },
    {
      icon: Server,
      title: "Secure Cloud Infrastructure",
      description: "Our platform is built on AWS with SOC 2 Type II certified infrastructure, using isolated environments and regular security audits."
    },
    {
      icon: FileCheck,
      title: "Access Controls",
      description: "Role-based access controls, multi-factor authentication, and detailed audit logs ensure only authorized personnel can access patient data."
    },
    {
      icon: Shield,
      title: "Regular Security Assessments",
      description: "We conduct regular penetration testing, vulnerability scanning, and third-party security audits to identify and address potential risks."
    },
  ];

  const complianceFrameworks = [
    "HIPAA Compliance", 
    "SOC 2 Type II", 
    "HITRUST CSF", 
    "GDPR Compliance", 
    "CCPA Compliance", 
    "ISO 27001"
  ];

  return (
    <>
      <Helmet>
        <title>Security & HIPAA Compliance | ConvoNotes Genius</title>
        <meta name="description" content="Learn about our comprehensive security measures and HIPAA compliance for protecting patient data in our AI-powered medical documentation platform." />
        <meta property="og:title" content="Security & HIPAA Compliance | ConvoNotes Genius" />
        <meta property="og:description" content="Learn about our comprehensive security measures and HIPAA compliance for protecting patient data in our AI-powered medical documentation platform." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/security" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
      </Helmet>

      <div className="pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Security Header */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <div className="bg-medical-light inline-flex p-3 rounded-full mb-4">
              <Shield className="h-8 w-8 text-medical-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Security & HIPAA Compliance</h1>
            <p className="text-xl text-gray-600">
              At ConvoNotes Genius, we prioritize the security and privacy of your patients' data. Our platform is designed with security at its core.
            </p>
          </div>

          {/* HIPAA Compliance Section */}
          <div className="bg-medical-primary text-white rounded-lg p-8 mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">HIPAA Compliance</h2>
                <p className="mb-6">
                  Our platform is fully HIPAA-compliant, designed with the specific requirements of healthcare data security in mind. We sign Business Associate Agreements (BAA) with all clients and implement all required safeguards.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-300 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg">Business Associate Agreement</h3>
                      <p>We provide a comprehensive BAA for all customers as part of our standard service agreement.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-300 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg">Technical Safeguards</h3>
                      <p>We implement all required technical safeguards including access controls, audit controls, integrity controls, and transmission security.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-green-300 shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-lg">Regular Risk Assessments</h3>
                      <p>We conduct regular risk assessments and have policies and procedures in place to address potential security incidents.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-lg">
                <FileText className="h-16 w-16 text-medical-primary mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">Business Associate Agreement</h3>
                <p className="text-gray-700 mb-4">
                  Our standard BAA covers all requirements under HIPAA and clearly defines responsibilities for both parties.
                </p>
                <a 
                  href="/baa-sample.pdf" 
                  className="text-medical-primary font-medium flex items-center hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Sample BAA
                </a>
              </div>
            </div>
          </div>

          {/* Security Features */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Our Security Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {securityFeatures.map((feature, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="bg-medical-light p-3 rounded-lg h-fit">
                        <feature.icon className="h-6 w-6 text-medical-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Compliance Frameworks */}
          <div className="bg-gray-50 rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Compliance Frameworks</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {complianceFrameworks.map((framework, index) => (
                <div 
                  key={index} 
                  className="bg-white p-4 rounded-lg shadow-sm text-center font-medium flex items-center justify-center h-20"
                >
                  {framework}
                </div>
              ))}
            </div>
          </div>

          {/* Data Protection */}
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Data Protection Practices</h2>
            <div className="prose max-w-none">
              <p>
                Our approach to data protection goes beyond compliance requirements. We implement defense in depth with multiple layers of security controls:
              </p>
              <ul>
                <li>
                  <strong>Data Minimization:</strong> We only collect and process the data necessary for the service to function.
                </li>
                <li>
                  <strong>Data Encryption:</strong> All sensitive data is encrypted both in transit and at rest.
                </li>
                <li>
                  <strong>Secure Development:</strong> We follow secure development practices and conduct regular code reviews.
                </li>
                <li>
                  <strong>Employee Training:</strong> All employees undergo regular security and privacy training.
                </li>
                <li>
                  <strong>Incident Response:</strong> We have a comprehensive incident response plan in case of a security breach.
                </li>
                <li>
                  <strong>Regular Audits:</strong> We conduct regular security audits and penetration testing.
                </li>
              </ul>
              <p>
                For more details about our security practices or to request a copy of our security documentation, please contact our security team at <a href="mailto:security@aidoctornotes.com">security@aidoctornotes.com</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Security;
