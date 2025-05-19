
import React from "react";

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      quote: "ConvoNotes Genius saves me 1 hour per session! I used to spend evenings catching up on documentation, but now I can complete my notes immediately after each session.",
      name: "Dr. Emily Chen",
      title: "Licensed Psychologist, New York",
      avatar: "/placeholder.svg"
    },
    {
      quote: "The mental health-specific AI understands therapy terminology perfectly. It captures interventions, conceptualizations, and treatment plans with remarkable accuracy.",
      name: "Mark Williams, LMFT",
      title: "Marriage & Family Therapist, California",
      avatar: "/placeholder.svg"
    },
    {
      quote: "I was spending 12+ hours weekly on paperwork. ConvoNotes Genius cut that down to just 2 hours. My work-life balance has completely transformed.",
      name: "Sarah Johnson, LCSW",
      title: "Clinical Social Worker, Texas",
      avatar: "/placeholder.svg"
    },
    {
      quote: "The automatic billing code suggestions have increased my insurance reimbursement by 15%. It catches details I would have missed in session documentation.",
      name: "Dr. Robert Martinez",
      title: "Clinical Psychologist, Illinois",
      avatar: "/placeholder.svg"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">What Therapists Say</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <div className="flex space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                      </svg>
                    ))}
                  </div>
                  <p className="italic text-gray-600 mb-4">
                    "{testimonial.quote}"
                  </p>
                </div>
                <div className="mt-auto flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full mr-4">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name} 
                      className="w-12 h-12 rounded-full"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
