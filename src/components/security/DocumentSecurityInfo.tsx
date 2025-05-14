
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Lock, History, Eye } from "lucide-react";

const DocumentSecurityInfo: React.FC = () => {
  const securityFeatures = [
    {
      icon: <Lock className="h-5 w-5 text-blue-600" />,
      title: "End-to-End Encryption",
      description: "All medical documents are encrypted during transmission and storage."
    },
    {
      icon: <FileCheck className="h-5 w-5 text-blue-600" />,
      title: "Access Controls",
      description: "Fine-grained permissions ensure only authorized personnel can access documents."
    },
    {
      icon: <History className="h-5 w-5 text-blue-600" />,
      title: "Audit Trails",
      description: "Comprehensive logging of all document access and modifications."
    },
    {
      icon: <Eye className="h-5 w-5 text-blue-600" />,
      title: "Data Privacy",
      description: "Patient identifiable information is protected according to HIPAA guidelines."
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Document Security</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-50 p-2 rounded-full">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocumentSecurityInfo;
