
import VoiceRecorder from "@/components/VoiceRecorder";
import ImageAnalyzer from "@/components/ImageAnalyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MedicalDocumentation = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="voice" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="voice">Voice Recording</TabsTrigger>
          <TabsTrigger value="image">Image Analysis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="voice" className="mt-6">
          <VoiceRecorder />
        </TabsContent>
        
        <TabsContent value="image" className="mt-6">
          <ImageAnalyzer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicalDocumentation;
