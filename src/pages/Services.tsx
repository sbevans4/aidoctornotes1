
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, FileText, Mic, Brain, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "AI Doctor Notes",
      description: "Transform patient encounters into structured clinical documentation in seconds, saving hours on paperwork daily.",
      icon: FileText,
      link: "/services/ai-doctor-notes",
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
      link: "/services/ai-medical-transcription",
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
      link: "/services/ai-therapy-notes",
      features: [
        "Therapy-specific templates",
        "Treatment planning tools",
        "Progress monitoring",
        "Insurance documentation"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

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
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
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
            </motion.div>
          ))}
        </motion.div>

        {/* Why Choose Us */}
        <div className="bg-gray-50 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Why Choose ConvoNotes Genius?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Save Time</h3>
              <p className="text-gray-600">Reduce documentation time by up to 75%, giving you more time to focus on patient care.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Improve Accuracy</h3>
              <p className="text-gray-600">Our AI models are trained on millions of medical records for unmatched accuracy and terminology.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">HIPAA Compliant</h3>
              <p className="text-gray-600">End-to-end encryption and secure processing ensures patient data remains protected.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-3">Seamless Integration</h3>
              <p className="text-gray-600">Integrates with major EHR systems for a streamlined documentation workflow.</p>
            </div>
          </div>
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
