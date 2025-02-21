
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";

interface ProcedureCodeValidatorProps {
  onValidate: (codes: string[]) => void;
}

const ProcedureCodeValidator = ({ onValidate }: ProcedureCodeValidatorProps) => {
  const [codes, setCodes] = useState<string[]>(Array(5).fill(""));
  const [validations, setValidations] = useState<boolean[]>(Array(5).fill(true));
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

  const formatProcedureCode = (code: string): string => {
    // Remove any non-alphanumeric characters and convert to uppercase
    return code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  };

  const validateProcedureCode = (code: string): boolean => {
    if (!code) return true; // Empty codes are considered valid
    // Common format for procedure codes: Letter followed by 4-5 digits
    const procedureCodeRegex = /^[A-Z]\d{4,5}$/;
    return procedureCodeRegex.test(code);
  };

  const handleCodeChange = async (index: number, value: string) => {
    try {
      const formattedCode = formatProcedureCode(value);
      const newCodes = [...codes];
      newCodes[index] = formattedCode;
      setCodes(newCodes);

      const isValid = validateProcedureCode(formattedCode);
      const newValidations = [...validations];
      newValidations[index] = isValid;
      setValidations(newValidations);

      if (!isValid && formattedCode) {
        toast({
          title: "Invalid Format",
          description: "Procedure code should be a letter followed by 4-5 digits",
          variant: "destructive",
        });
        return;
      }

      // Only save valid non-empty codes
      if (formattedCode && isValid) {
        await supabase
          .from('procedure_codes')
          .upsert([
            { code: formattedCode }
          ], {
            onConflict: 'code'
          });

        // Validate and notify parent only with valid codes
        const validCodes = newCodes.filter((code, i) => code && newValidations[i]);
        if (validCodes.length > 0) {
          onValidate(validCodes);
        }
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
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Procedure Codes</h2>
          <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        </div>
        <p className="text-sm text-muted-foreground">
          Enter procedure codes in the format: one letter followed by 4-5 digits (e.g., A1234 or B12345)
        </p>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {codes.map((code, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`code-${index}`} className="sr-only">
                Procedure Code {index + 1}
              </Label>
              <Input
                id={`code-${index}`}
                placeholder={`Code ${index + 1}`}
                value={code}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                className={`w-full ${!validations[index] ? 'border-red-500' : ''}`}
                aria-invalid={!validations[index]}
                aria-describedby={!validations[index] ? `error-${index}` : undefined}
              />
              {!validations[index] && code && (
                <p id={`error-${index}`} className="text-sm text-red-500">
                  Invalid format
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProcedureCodeValidator;

