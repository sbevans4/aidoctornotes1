
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Testimonial {
  quote: string;
  author: string;
  title: string;
  image?: string;
  organization?: string;
}

export const TestimonialsSection = () => {
  const testimonials: Testimonial[] = [
    {
      quote: "AIDoctorNotes has saved me over 2 hours every day on documentation. The AI accurately captures my patient conversations and generates perfect SOAP notes.",
      author: "Dr. Sarah Chen",
      title: "Family Medicine",
      organization: "Westside Medical Group",
      image: "/testimonial-1.jpg"
    },
    {
      quote: "The HIPAA compliance and EHR integration make this tool invaluable. I can focus on my patients instead of my computer screen.",
      author: "Dr. Michael Rodriguez",
      title: "Internal Medicine",
      organization: "Central Health Partners",
      image: "/testimonial-2.jpg"
    },
    {
      quote: "The documentation quality is exceptional. AIDoctorNotes captures nuances in patient conversations that I would miss when taking notes manually during appointments.",
      author: "Dr. Jessica Williams",
      title: "Pediatrician",
      organization: "Children's Health Center",
      image: "/testimonial-3.jpg"
    },
  ];
  
  return (
    <section className="py-16 bg-gray-50" id="testimonials">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Trusted by Healthcare Professionals</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            See how our AI-powered medical documentation is transforming workflows for doctors nationwide
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex flex-col h-full">
                <div className="mb-4 text-lg italic text-gray-600">
                  "{testimonial.quote}"
                </div>
                
                <div className="mt-auto flex items-center gap-3 pt-4 border-t">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={testimonial.image} alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.title}
                      {testimonial.organization && `, ${testimonial.organization}`}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
