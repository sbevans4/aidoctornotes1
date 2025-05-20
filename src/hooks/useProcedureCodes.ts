
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

export function useProcedureCodes(transcript: string | null) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [procedureCodes, setProcedureCodes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Function to fetch suggested procedure codes based on transcript
  const getSuggestedCodes = useCallback(async (transcriptText: string, forceRefresh: boolean = false) => {
    if (!transcriptText || !user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the Supabase Edge Function to get code suggestions
      const { data, error } = await supabase.functions.invoke('suggest-procedure-codes', {
        body: { 
          transcription: transcriptText,
          refresh: forceRefresh 
        }
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
  }, [user]);

  // Function to refresh code suggestions
  const refreshSuggestedCodes = async (transcriptText: string) => {
    if (!transcriptText || !user) return;
    
    setIsRefreshing(true);
    
    try {
      await getSuggestedCodes(transcriptText, true);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Function to save a specific code and increment its frequency
  const saveCode = useCallback(async (code: string) => {
    if (!user) return;
    
    try {
      // Insert or update the code in the procedure_codes table
      const { error } = await supabase.from('procedure_codes').upsert(
        {
          user_id: user.id,
          code: code,
        },
        {
          onConflict: 'user_id, code',
          ignoreDuplicates: false
        }
      );
      
      if (error) throw error;
      
      // Increment frequency counter for this code using the new RPC function
      const { error: rpcError } = await supabase.rpc('increment_code_frequency', { 
        p_user_id: user.id, 
        p_code: code 
      });
      
      if (rpcError) {
        console.error("Error incrementing code frequency:", rpcError);
      }
      
    } catch (err: any) {
      console.error("Error saving procedure code:", err);
    }
  }, [user]);

  // Function to get frequently used codes 
  const getFrequentCodes = useCallback(async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('procedure_codes')
        .select('code, frequency')
        .eq('user_id', user.id)
        .order('frequency', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      return data.map(item => item.code);
    } catch (err: any) {
      console.error("Error fetching frequent codes:", err);
      return [];
    }
  }, [user]);

  // Initialize code suggestions when transcript is available
  useEffect(() => {
    if (transcript) {
      getSuggestedCodes(transcript);
    }
  }, [transcript, getSuggestedCodes]);

  return {
    procedureCodes,
    setProcedureCodes,
    isLoading,
    error,
    isRefreshing,
    getSuggestedCodes,
    refreshSuggestedCodes,
    saveCode,
    getFrequentCodes
  };
}
