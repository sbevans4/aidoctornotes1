
import React from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mic, Check, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AIMedicalTranscription = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: "Medical Specialty Recognition",
      description: "Our AI is trained on terminology for 30+ medical specialties, from cardiology to psychiatry."
    },
    {
      title: "Multi-speaker Differentiation",
      description: "Accurately distinguishes between different speakers in a clinical conversation."
    },
    {
      title: "Accent & Dialect Support",
      description: "Works with diverse accents and dialects with high accuracy rates."
    },
    {
      title: "Background Noise Filtering",
      description: "Advanced noise cancellation for clear transcription even in busy clinical environments."
    }
  ];

  const accuracyMetrics = [
    { label: "General Medical Terminology", value: 98 },
    { label: "Specialty-Specific Terms", value: 96 },
    { label: "Medication Names", value: 97 },
    { label: "Patient Instructions", value: 99 }
  ];

  return (
    <>
      <Helmet>
        <title>AI Medical Transcription | ConvoNotes Genius</title>
        <meta name="description" content="AI-powered medical transcription that converts doctor-patient conversations into accurate text with medical terminology." />
        <meta property="og:title" content="AI Medical Transcription | ConvoNotes Genius" />
        <meta property="og:description" content="AI-powered medical transcription that converts doctor-patient conversations into accurate text with medical terminology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://aidoctornotes.com/services/ai-medical-transcription" />
        <meta property="og:image" content="https://aidoctornotes.com/og-image.png" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "ConvoNotes Genius AI Medical Transcription",
              "applicationCategory": "HealthcareApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "19.99",
                "priceCurrency": "USD"
              },
              "description": "AI-powered medical transcription that converts doctor-patient conversations into accurate text with medical terminology."
            }
          `}
        </script>
      </Helmet>

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  AI Medical Transcription: Accuracy at Scale
                </h1>
                <p className="text-xl mb-6">
                  Convert medical conversations into accurate text with proper terminology, punctuation, and speaker identification.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    size="lg"
                    onClick={() => navigate("/auth")}
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Start Free 14-Day Trial <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={() => navigate("/medical-documentation")}
                    className="text-white border-white hover:bg-white/10"
                  >
                    View Demo
                  </Button>
                </div>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="/placeholder.svg" 
                  alt="AI Medical Transcription Interface" 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Accuracy Stats */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Industry-Leading Accuracy</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our AI transcription engine is trained on millions of hours of medical conversations to deliver unmatched accuracy
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {accuracyMetrics.map((metric, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-4 mx-auto w-28 h-28">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-3xl font-bold text-blue-600">{metric.value}%</div>
                    </div>
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#e5e7eb" 
                        strokeWidth="8" 
                      />
                      <circle 
                        cx="50" cy="50" r="45" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="8"
                        strokeDasharray={`${2 * Math.PI * 45 * metric.value / 100} ${2 * Math.PI * 45 * (1 - metric.value / 100)}`}
                        strokeDashoffset={(2 * Math.PI * 45) / 4}
                      />
                    </svg>
                  </div>
                  <p className="font-medium">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Key Transcription Features</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex">
                  <div className="mr-4 bg-blue-100 p-2 rounded-lg h-fit">
                    <Check className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Medical Transcription Use Cases</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Our transcription technology supports a wide range of clinical documentation needs
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <div className="bg-blue-50 rounded-lg p-6">
                <Mic className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Patient Encounters</h3>
                <p className="text-gray-700">
                  Transcribe doctor-patient conversations during examinations for comprehensive documentation.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <Mic className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Medical Procedures</h3>
                <p className="text-gray-700">
                  Document procedural steps, observations, and results in real-time during medical procedures.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <Mic className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Team Consultations</h3>
                <p className="text-gray-700">
                  Capture multi-physician consultations and collaborative case discussions accurately.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <Mic className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Patient Instructions</h3>
                <p className="text-gray-700">
                  Document detailed care instructions and treatment plans given to patients.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <Mic className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Clinical Research</h3>
                <p className="text-gray-700">
                  Transcribe research interviews, patient feedback, and study observations.
                </p>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-6">
                <Mic className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold mb-3">Telehealth Sessions</h3>
                <p className="text-gray-700">
                  Automatically transcribe remote patient consultations for thorough record keeping.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Medical Transcription</h2>
            
            <div className="max-w-4xl mx-auto">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-4 border-b-2"></th>
                      <th className="p-4 border-b-2 text-center bg-blue-50">ConvoNotes Genius</th>
                      <th className="p-4 border-b-2 text-center">Traditional Services</th>
                      <th className="p-4 border-b-2 text-center">General AI</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-b font-medium">Medical Accuracy</td>
                      <td className="p-4 border-b text-center bg-blue-50">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 border-b text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 border-b text-center">
                        <div className="w-5 h-1 bg-gray-300 rounded mx-auto"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b font-medium">Speed</td>
                      <td className="p-4 border-b text-center bg-blue-50">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 border-b text-center">
                        <div className="w-5 h-1 bg-gray-300 rounded mx-auto"></div>
                      </td>
                      <td className="p-4 border-b text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b font-medium">Cost</td>
                      <td className="p-4 border-b text-center bg-blue-50">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 border-b text-center">
                        <div className="w-5 h-1 bg-gray-300 rounded mx-auto"></div>
                      </td>
                      <td className="p-4 border-b text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b font-medium">HIPAA Compliance</td>
                      <td className="p-4 border-b text-center bg-blue-50">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 border-b text-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 border-b text-center">
                        <div className="w-5 h-1 bg-gray-300 rounded mx-auto"></div>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b font-medium">EHR Integration</td>
                      <td className="p-4 border-b text-center bg-blue-50">
                        <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                      <td className="p-4 border-b text-center">
                        <div className="w-5 h-1 bg-gray-300 rounded mx-auto"></div>
                      </td>
                      <td className="p-4 border-b text-center">
                        <div className="w-5 h-1 bg-gray-300 rounded mx-auto"></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Experience Medical-Grade Transcription</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals already using our AI-powered medical transcription
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
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIMedicalTranscription;
