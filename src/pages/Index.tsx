import VoiceRecorder from "@/components/VoiceRecorder";
import ProcedureCodes from "@/components/ProcedureCodes";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-medical-primary text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">Medical Transcription Assistant</h1>
          <p className="text-medical-light mt-2">Record and generate SOAP notes effortlessly</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <ProcedureCodes />
        <VoiceRecorder />
      </main>
    </div>
  );
};

export default Index;