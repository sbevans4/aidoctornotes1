
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Mic, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ServicesSection = () => {
  const navigate = useNavigate();
  
  const services = [
    {
      title: "AI Doctor Notes",
      description: "Transform patient encounters into structured clinical documentation in seconds, saving hours on paperwork daily.",
      icon: FileText,
      link: "/services/ai-doctor-notes",
    },
    {
      title: "AI Medical Transcription",
      description: "High-accuracy, real-time conversion of medical conversations to text with specialty-specific terminology.",
      icon: Mic,
      link: "/services/ai-medical-transcription",
    },
    {
      title: "AI Therapy Notes",
      description: "Purpose-built for mental health providers with templates for therapy sessions, assessments, and treatment plans.",
      icon: Brain,
      link: "/services/ai-therapy-notes",
    }
  ];

  return (
    <section className="py-16 bg-white" id="services">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Intelligent AI solutions designed specifically for healthcare documentation needs
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-gray-50 rounded-lg p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="mb-4 bg-gray-100 inline-block p-3 rounded-lg">
                <service.icon className="h-8 w-8 text-blue-600" />
              </div>
              
              <h3 className="text-xl font-bold mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-5">{service.description}</p>
              
              <Button 
                variant="link" 
                className="p-0 h-auto font-medium text-blue-600 flex items-center gap-1"
                onClick={() => navigate(service.link)}
              >
                Learn More <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button 
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </section>
  );
};
