
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface ProcedureCodeValidatorProps {
  onValidate: (codes: string[]) => void;
}

const ProcedureCodeValidator = ({ onValidate }: ProcedureCodeValidatorProps) => {
  const [codes, setCodes] = useState<string[]>(Array(5).fill(""));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProcedureCodes();
  }, []);

  const loadProcedureCodes = async () => {
    try {
      const { data: procedureCodes, error } = await supabase
        .from('procedure_codes')
        .select('code')
        .order('created_at', { ascending: true })
        .limit(5);

      if (error) {
        throw error;
      }

      if (procedureCodes.length > 0) {
        const loadedCodes = procedureCodes.map(pc => pc.code);
        setCodes([...loadedCodes, ...Array(5 - loadedCodes.length).fill("")]);
      }
    } catch (error) {
      console.error("Error loading procedure codes:", error);
      toast({
        title: "Error",
        description: "Failed to load procedure codes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeChange = async (index: number, value: string) => {
    try {
      const newCodes = [...codes];
      newCodes[index] = value;
      setCodes(newCodes);

      // Only save non-empty codes
      if (value) {
        await supabase
          .from('procedure_codes')
          .upsert([
            { code: value }
          ], {
            onConflict: 'code'
          });
      }

      // Validate and notify parent
      const validCodes = newCodes.filter(Boolean);
      if (validCodes.length > 0) {
        onValidate(validCodes);
      }
    } catch (error) {
      console.error("Error saving procedure code:", error);
      toast({
        title: "Error",
        description: "Failed to save procedure code",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Procedure Codes</h2>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {codes.map((code, index) => (
          <Input
            key={index}
            placeholder={`Code ${index + 1}`}
            value={code}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            className="w-full"
          />
        ))}
      </div>
    </Card>
  );
};

export default ProcedureCodeValidator;
