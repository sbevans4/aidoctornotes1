
import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface KeyFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface KeyFeaturesProps {
  features: KeyFeatureProps[];
}

export const KeyFeatures = ({ features }: KeyFeaturesProps) => {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
      {features.map((feature) => (
        <Card key={feature.title} className="p-6 text-center">
          <feature.icon className="w-12 h-12 mx-auto mb-4 text-medical-primary" />
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </Card>
      ))}
    </div>
  );
};
