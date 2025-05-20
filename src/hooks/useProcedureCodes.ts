
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function useProcedureCodes(transcript: string | null) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [procedureCodes, setProcedureCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch suggested procedure codes based on transcript
  const getSuggestedCodes = async (transcriptText: string) => {
    if (!transcriptText || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the Supabase Edge Function to get code suggestions
      const { data, error } = await supabase.functions.invoke('suggest-procedure-codes', {
        body: { transcription: transcriptText }
      });
      
      if (error) throw error;
      
      if (data?.codes && Array.isArray(data.codes)) {
        setProcedureCodes(data.codes);
        
        if (data.source === 'cache') {
          console.log("Used cached procedure codes");
        } else {
          console.log("Generated new procedure code suggestions");
        }
        
        return data.codes;
      } else {
        console.warn("No procedure codes returned");
        return [];
      }
    } catch (err: any) {
      setError(err.message || "Failed to get procedure code suggestions");
      console.error("Error getting procedure codes:", err);
      toast({
        title: "Error",
        description: "Failed to suggest procedure codes. Please enter them manually.",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Function to save a specific code
  const saveCode = async (code: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase.from('procedure_codes').upsert(
        {
          user_id: user.id,
          code: code,
          frequency: 1
        },
        {
          onConflict: 'user_id, code',
          ignoreDuplicates: false
        }
      );
      
      if (error) throw error;
      
      // Increment frequency counter for this code
      await supabase.rpc('increment_code_frequency', { 
        p_user_id: user.id, 
        p_code: code 
      });
      
    } catch (err: any) {
      console.error("Error saving procedure code:", err);
    }
  };

  // Initialize code suggestions when transcript is available
  useEffect(() => {
    if (transcript) {
      getSuggestedCodes(transcript);
    }
  }, [transcript]);

  return {
    procedureCodes,
    setProcedureCodes,
    isLoading,
    error,
    getSuggestedCodes,
    saveCode
  };
}
