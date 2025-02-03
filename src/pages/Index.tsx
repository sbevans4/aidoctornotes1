import VoiceRecorder from "@/components/VoiceRecorder";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-medical-primary text-white py-6">
        <div className="container">
          <h1 className="text-2xl font-semibold">Medical Transcription Assistant</h1>
          <p className="text-medical-light mt-2">Record and generate SOAP notes effortlessly</p>
        </div>
      </header>
      
      <main className="container py-8">
        <VoiceRecorder />
      </main>
    </div>
  );
};

export default Index;