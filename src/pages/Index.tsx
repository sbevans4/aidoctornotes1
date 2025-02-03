import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import ProcedureCodes from "@/components/ProcedureCodes";
import RoleSelection from "@/components/RoleSelection";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Settings } from "lucide-react";

const Index = () => {
  const [hasSelectedRole, setHasSelectedRole] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-medical-primary text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-semibold">Medical Transcription Assistant</h1>
          <p className="text-medical-light mt-2">Intelligent documentation for healthcare professionals</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {!hasSelectedRole ? (
          <RoleSelection onRoleSelected={() => setHasSelectedRole(true)} />
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                <div className="space-y-4">
                  <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                    <Mic className="w-4 h-4" />
                    Start New Recording
                  </Button>
                  <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                    <Settings className="w-4 h-4" />
                    Personalization Settings
                  </Button>
                </div>
              </Card>
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                <p className="text-gray-500">No recent recordings found</p>
              </Card>
            </div>
            <ProcedureCodes />
            <VoiceRecorder />
          </>
        )}
      </main>
    </div>
  );
};

export default Index;