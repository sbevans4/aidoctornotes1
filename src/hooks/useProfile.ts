
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  has_used_trial: boolean | null;
  created_at: string;
  updated_at: string;
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { data: profiles, error, isLoading: isQueryLoading } = useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      try {
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
        
        return data as Profile[];
      } catch (error) {
        console.error("Unexpected error:", error);
        return null;
      }
    },
  });
  
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
      return data as Profile[];
    } catch (error) {
      console.error("Unexpected error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentProfile = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication error",
          description: "You must be logged in to view profile information",
          variant: "destructive",
        });
        return null;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error("Unexpected error:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profiles,
    getProfiles,
    getCurrentProfile,
    isLoading: isLoading || isQueryLoading,
    error
  };
};
