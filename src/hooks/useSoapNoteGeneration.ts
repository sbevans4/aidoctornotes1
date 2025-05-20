
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface SoapNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export function useSoapNoteGeneration() {
  const [isGeneratingSoap, setIsGeneratingSoap] = useState(false);
  const [soapNote, setSoapNote] = useState<SoapNote | null>(null);
  const [soapError, setSoapError] = useState<string | null>(null);
  const [procedureCodes, setProcedureCodes] = useState<string[]>([]);

  const generateSoapNote = async (transcriptText: string, noteId: string | null = null) => {
    if (!transcriptText) {
      return;
    }
    
    setIsGeneratingSoap(true);
    setSoapError(null);
    
    try {
      // Call the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('generate-soap', {
        body: { 
          transcription: transcriptText,
          noteId: noteId,
          procedureCodes: procedureCodes,
        },
      });
      
      if (error) throw error;
      
      if (data && data.soap_note) {
        setSoapNote(data.soap_note);
        toast({
          title: "SOAP Note Generated",
          description: "Your medical documentation is ready.",
        });
      } else {
        throw new Error('No SOAP note returned from the service');
      }
    } catch (error) {
      setSoapError(error.message || 'Failed to generate SOAP note');
      toast({
        title: "SOAP Note Generation Failed",
        description: error.message || "There was an error creating your documentation.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSoap(false);
    }
  };

  const saveSoapNote = async (note: SoapNote, noteId: string) => {
    if (!noteId) return;
    
    try {
      const { error } = await supabase
        .from('clinical_notes')
        .update({
          soap_note: note,
          updated_at: new Date().toISOString(),
        })
        .eq('id', noteId);
      
      if (error) throw error;
      
      toast({
        title: "Note Saved",
        description: "Your SOAP note has been saved successfully."
      });
    } catch (error) {
      toast({
        title: "Save Error",
        description: error.message || "Failed to save your note.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const emailSoapNote = async (note: SoapNote) => {
    try {
      // This would call an edge function to send email
      // For now, just show a toast
      toast({
        title: "Email Feature",
        description: "Email functionality will be implemented in a future update.",
      });
    } catch (error) {
      toast({
        title: "Email Error",
        description: error.message || "Failed to send email.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetSoapNote = () => {
    setSoapNote(null);
    setSoapError(null);
  };

  return {
    isGeneratingSoap,
    soapNote,
    soapError,
    procedureCodes,
    setProcedureCodes,
    generateSoapNote,
    saveSoapNote,
    emailSoapNote,
    resetSoapNote
  };
}
