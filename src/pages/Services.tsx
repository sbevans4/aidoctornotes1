
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Mic, Brain, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "AI Doctor Notes",
      description: "Transform patient encounters into structured clinical documentation in seconds, saving hours on paperwork daily.",
      icon: FileText,
      link: "/services/doctor-notes",
      features: [
        "SOAP note generation",
        "Medical terminology recognition",
        "EHR integration",
        "Specialty-specific templates"
      ]
    },
    {
      title: "AI Medical Transcription",
      description: "High-accuracy, real-time conversion of medical conversations to text with specialty-specific terminology.",
      icon: Mic,
      link: "/services/transcription",
      features: [
        "Real-time transcription",
        "Multi-speaker recognition",
        "Medical terminology accuracy",
        "Background noise filtering"
      ]
    },
    {
      title: "AI Therapy Notes",
      description: "Purpose-built for mental health providers with templates for therapy sessions, assessments, and treatment plans.",
      icon: Brain,
      link: "/services/therapy-notes",
      features: [
        "Therapy-specific templates",
        "Treatment planning tools",
        "Progress monitoring",
        "Insurance documentation"
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Our Services | ConvoNotes Genius</title>
        <meta 
          name="description" 
          content="Explore our AI-powered medical documentation solutions including doctor notes, medical transcription, and therapy notes."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            ConvoNotes Genius offers a suite of AI-powered solutions designed to reduce documentation burden for healthcare professionals, improve accuracy, and give you more time with patients.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <Card key={index} className="h-full flex flex-col hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mb-4 bg-blue-100 inline-block p-3 rounded-lg">
                  <service.icon className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <ul className="space-y-2">
                  {service.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => navigate(service.link)}
                >
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-blue-600 text-white p-12 rounded-xl">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Documentation Workflow?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of healthcare professionals already using ConvoNotes Genius
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start Free 14-Day Trial
            </Button>
            <Button 
              size="lg"
              variant="outline"
              onClick={() => navigate("/contact")}
              className="text-white border-white hover:bg-white/10"
            >
              Request a Demo
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Services;
