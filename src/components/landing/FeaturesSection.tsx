import { Card } from "@/components/ui/card";
import { Headset, FileText, ChartBar } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center">
            <Headset className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
            <h3 className="text-xl font-semibold mb-2">Real-time Transcription</h3>
            <p className="text-gray-600">
              Instantly convert medical conversations into text with high accuracy
            </p>
          </Card>
          <Card className="p-6 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
            <h3 className="text-xl font-semibold mb-2">SOAP Note Generation</h3>
            <p className="text-gray-600">
              Automatically structure notes in SOAP format with AI assistance
            </p>
          </Card>
          <Card className="p-6 text-center">
            <ChartBar className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
            <h3 className="text-xl font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-gray-600">
              Track productivity and gain insights from your documentation
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};