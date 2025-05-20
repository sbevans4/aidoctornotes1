
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import TemplateSelector from "./advanced-documentation/TemplateSelector";
import { TranscriptionProvider } from "@/contexts/TranscriptionContext";
import RecordingArea from "./voiceRecorder/RecordingArea";
import TranscriptArea from "./voiceRecorder/TranscriptArea";
import SoapNoteArea from "./voiceRecorder/SoapNoteArea";
import AudioProcessingHandler from "./voiceRecorder/AudioProcessingHandler";
import TranscriptionHandler from "./voiceRecorder/TranscriptionHandler";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const VoiceRecorder = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("general");
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const { toast } = useToast();

  // Track session metrics
  useEffect(() => {
    // Log session start
    const logSessionStart = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error } = await supabase.from('analytics').insert({
            user_id: user.id,
            metrics: {
              event: 'session_start',
              template: selectedTemplateId,
              session_id: sessionId,
              timestamp: new Date().toISOString(),
              user_agent: navigator.userAgent,
              platform: navigator.platform
            }
          });
          
          if (error) {
            console.error("Failed to log session start:", error);
          }
        }
      } catch (error) {
        console.error("Analytics error:", error);
      }
    };
    
    logSessionStart();
    
    // Log session end on component unmount
    return () => {
      const logSessionEnd = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            await supabase.from('analytics').insert({
              user_id: user.id,
              metrics: {
                event: 'session_end',
                template: selectedTemplateId,
                session_id: sessionId,
                duration: Date.now() - parseInt(sessionId.split('_')[1]),
                timestamp: new Date().toISOString()
              }
            });
          }
        } catch (error) {
          console.error("Analytics error:", error);
        }
      };
      
      logSessionEnd();
    };
  }, [sessionId, selectedTemplateId]);

  const handleTemplateChange = (templateId: string) => {
    console.log("Template changed to:", templateId);
    setSelectedTemplateId(templateId);
    
    // Track template change
    const logTemplateChange = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase.from('analytics').insert({
            user_id: user.id,
            metrics: {
              event: 'template_change',
              from: selectedTemplateId,
              to: templateId,
              session_id: sessionId,
              timestamp: new Date().toISOString()
            }
          });
        }
      } catch (error) {
        console.error("Analytics error:", error);
      }
    };
    
    logTemplateChange();
  };

  const handleAudioProcessed = (blob: Blob) => {
    console.log("Audio processed in VoiceRecorder component", blob);
    setAudioBlob(blob);
    
    // Track audio recording completion
    const logAudioRecorded = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          await supabase.from('analytics').insert({
            user_id: user.id,
            metrics: {
              event: 'audio_recorded',
              blob_size: blob.size,
              blob_type: blob.type,
              template: selectedTemplateId,
              session_id: sessionId,
              timestamp: new Date().toISOString()
            }
          });
        }
      } catch (error) {
        console.error("Analytics error:", error);
      }
    };
    
    logAudioRecorded();
    
    // Check if device is running low on memory
    if ('memory' in performance) {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo && memoryInfo.usedJSHeapSize > memoryInfo.jsHeapSizeLimit * 0.8) {
        toast({
          title: "Performance Warning",
          description: "Your device is running low on memory. Consider closing other tabs or applications.",
          variant: "destructive", // Changed from "warning" to "destructive"
        });
      }
    }
  };

  return (
    <TranscriptionProvider initialTemplate={selectedTemplateId}>
      <div className="space-y-6">
        <TemplateSelector 
          selectedTemplateId={selectedTemplateId}
          onChange={handleTemplateChange}
        />
        
        <Card className="p-6">
          <RecordingArea onAudioProcessed={handleAudioProcessed} />
          <TranscriptArea />
          <SoapNoteArea />
          
          {/* Logic components - no UI */}
          <AudioProcessingHandler audioBlob={audioBlob || undefined} />
          <TranscriptionHandler />
        </Card>
      </div>
    </TranscriptionProvider>
  );
};

export default VoiceRecorder;
