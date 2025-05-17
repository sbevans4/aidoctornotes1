
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const getProfiles = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('profiles').select('*');
      
      if (error) {
        console.error("Error fetching profiles:", error);
        toast({
          title: "Error fetching profiles",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
      
      console.log("Profiles data:", data);
      return data;
    } catch (error) {
      console.error("Unexpected error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    getProfiles,
    isLoading
  };
};
