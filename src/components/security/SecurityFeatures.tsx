
import React from "react";
import { Shield, Lock, FileCheck, Server } from "lucide-react";

interface SecurityFeature {
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
}

const SecurityFeatures: React.FC = () => {
  const securityFeatures: SecurityFeature[] = [
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
  );
};

export default SecurityFeatures;
