
import React from "react";

interface Testimonial {
  quote: string;
  author: string;
  specialty: string;
  plan: string;
}

interface FeatureTestimonialsProps {
  testimonials: Testimonial[];
}

export const FeatureTestimonials = ({ testimonials }: FeatureTestimonialsProps) => {
  return (
    <div className="mt-16">
      <h3 className="text-2xl font-bold text-center mb-8">What Our Users Say</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((testimonial, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
            <div>
              <p className="font-semibold">{testimonial.author}</p>
              <p className="text-sm text-gray-500">{testimonial.specialty}</p>
              <p className="text-sm text-blue-600 mt-1">
                <span className="font-medium">{testimonial.plan}</span> plan user
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
