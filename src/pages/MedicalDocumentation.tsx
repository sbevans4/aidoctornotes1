import { Shield, Clock, AlertTriangle, FileCheck, Brain, ChartBarIncreasing, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const MedicalDocumentation = () => {
  const navigate = useNavigate();

  const fears = [
    {
      title: "Malpractice Lawsuits Due to Poor Documentation",
      risk: "Vague or missing notes can result in legal exposure. If a lawsuit arises and your documentation doesn't fully justify treatment decisions, it becomes a liability.",
      solution: "AI-powered real-time transcription & structured clinical notes ensure that every detail is accurately recorded and timestamped for legal protection.",
      icon: Shield,
    },
    {
      title: "Billing & Insurance Fraud Accusations",
      risk: "Incorrect coding (ICD-10, CPT, or E/M levels) can trigger audits or fraud investigations.",
      solution: "Automated AI-driven coding assistance suggests the correct ICD-10 & CPT codes based on conversation context.",
      icon: AlertTriangle,
    },
    {
      title: "Time-Consuming Note-Taking & Burnout",
      risk: "The average physician spends 2+ hours on documentation for every 1 hour of patient care.",
      solution: "AI-generated summaries turn your dictated conversation into a structured SOAP note, reducing documentation workload by 50-70%.",
      icon: Clock,
    },
    {
      title: "HIPAA Violations & Data Breaches",
      risk: "If notes aren't properly encrypted and secured, PHI can be leaked, leading to hefty fines.",
      solution: "HIPAA-compliant transcription software with end-to-end encryption ensures patient data remains private and secure.",
      icon: FileCheck,
    },
    {
      title: "Miscommunication & Patient Safety Risks",
      risk: "Incomplete or unclear notes can lead to treatment errors or gaps in continuity of care.",
      solution: "AI-generated structured notes & real-time error detection flag missing details, ensuring accuracy.",
      icon: Brain,
    },
    {
      title: "AI-Generated Errors in Medical Documentation",
      risk: "Some providers worry that AI-powered notes might misinterpret speech or fail to capture clinical nuance.",
      solution: "Physician-trained AI that continuously learns from corrections, ensuring high transcription accuracy.",
      icon: ChartBarIncreasing,
    },
  ];

  const comparisonData = [
    {
      metric: "Time Spent",
      traditional: "2-3 hours/day on EHRs",
      aiOptimized: "50-70% time reduction",
    },
    {
      metric: "Billing Accuracy",
      traditional: "High risk of denials & audits",
      aiOptimized: "Auto-coded with AI accuracy",
    },
    {
      metric: "Legal Protection",
      traditional: "Notes may be incomplete",
      aiOptimized: "AI-structured, timestamped, & legally compliant",
    },
    {
      metric: "HIPAA Compliance",
      traditional: "High risk if not encrypted",
      aiOptimized: "End-to-end encrypted, HIPAA-compliant",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-medical-light to-white">
      {/* SEO Meta Tags */}
      <head>
        <title>AI-Powered Medical Documentation: Reduce Legal Risks & Save Time | Medical Transcription Software</title>
        <meta name="description" content="Discover how AI-powered medical transcription & coding software can protect your practice from legal risks, billing errors, and physician burnout. HIPAA-compliant solution for healthcare providers." />
        <meta name="keywords" content="medical transcription software, AI-powered clinical documentation, HIPAA-compliant speech-to-text, medical dictation software 2024, ICD-10 coding automation" />
      </head>

      {/* Hero Section */}
      <header className="bg-medical-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-4xl mx-auto text-center">
            How AI-Powered Transcription & Medical Coding Can Protect Your Practice from Legal Risks, Billing Errors, and Burnout
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-center">
            Transform your clinical documentation with AI-powered solutions that save time, reduce risk, and improve accuracy.
          </p>
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={() => navigate("/signup")}
              className="bg-white text-medical-primary hover:bg-gray-100"
            >
              Try AI-Powered Medical Transcription Today
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-16">
        {/* Why Notes Matter Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6 text-center">Why Your Clinical Notes Matter More Than Ever</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto text-center">
            Every dentist and physician understands that good documentation isn't just about record-keeping—it's about legal protection, accurate billing, and patient safety.
          </p>
        </section>

        {/* Common Fears Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">6 Common Fears About Clinical Notes (And How to Solve Them)</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fears.map((fear, index) => (
              <Card key={index} className="p-6">
                <fear.icon className="w-12 h-12 text-medical-primary mb-4" />
                <h3 className="text-xl font-semibold mb-4">{fear.title}</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-red-600 mb-2">The Risk:</h4>
                    <p className="text-gray-700">{fear.risk}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-green-600 mb-2">The Solution:</h4>
                    <p className="text-gray-700">{fear.solution}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">How AI-Powered Medical Documentation Can Save Your Practice</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-medical-primary text-white">
                  <th className="p-4 text-left">Concern</th>
                  <th className="p-4 text-left">Traditional Notes</th>
                  <th className="p-4 text-left">AI-Optimized Notes</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="p-4 font-medium">{row.metric}</td>
                    <td className="p-4 text-red-600">{row.traditional}</td>
                    <td className="p-4 text-green-600">{row.aiOptimized}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Documentation Process?</h2>
          <Button
            size="lg"
            onClick={() => navigate("/signup")}
            className="bg-medical-primary text-white hover:bg-medical-secondary"
          >
            Start Your Free Trial Today
          </Button>
        </section>
      </main>
    </div>
  );
};

export default MedicalDocumentation;