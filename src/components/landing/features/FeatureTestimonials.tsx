
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  quote: string;
  author: string;
  specialty: string;
  plan: string;
}

interface FeatureTestimonialsProps {
  testimonials: Testimonial[];
}

export const FeatureTestimonials: React.FC<FeatureTestimonialsProps> = ({ testimonials }) => {
  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-center mb-8">What Healthcare Professionals Are Saying</h3>
      
      <div className="grid gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="italic text-gray-700 mb-4">"{testimonial.quote}"</p>
              <div className="mt-4">
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-muted-foreground">{testimonial.specialty}</p>
                <p className="text-xs text-blue-600 mt-1">{testimonial.plan} Plan User</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
