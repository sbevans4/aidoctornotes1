
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CodeHeader } from "./procedure-codes/CodeHeader";
import { CodeInput } from "./procedure-codes/CodeInput";

interface ProcedureCodeValidatorProps {
  onValidate: (codes: string[]) => void;
}

const ProcedureCodeValidator = ({ onValidate }: ProcedureCodeValidatorProps) => {
  const [codes, setCodes] = useState<string[]>(Array(5).fill(""));
  const [validations, setValidations] = useState<boolean[]>(Array(5).fill(true));
  const [isLoading, setIsLoading] = useState(true);
  const [debounceTimers, setDebounceTimers] = useState<NodeJS.Timeout[]>(Array(5).fill(null));
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [autoSave, setAutoSave] = useState(true);
  const [showValidation, setShowValidation] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProcedureCodes();
    return () => {
      debounceTimers.forEach(timer => timer && clearTimeout(timer));
    };
  }, []);

  const loadProcedureCodes = async () => {
    try {
      setError(null);
      setIsLoading(true);
      const { data: procedureCodes, error: fetchError } = await supabase
        .from('procedure_codes')
        .select('code')
        .order('created_at', { ascending: true })
        .limit(5);

      if (fetchError) throw fetchError;

      if (procedureCodes.length > 0) {
        const loadedCodes = procedureCodes.map(pc => pc.code);
        setCodes([...loadedCodes, ...Array(5 - loadedCodes.length).fill("")]);
        // Validate loaded codes
        setValidations(loadedCodes.map(code => validateProcedureCode(code)));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load procedure codes';
      setError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatProcedureCode = (code: string): string => {
    return code.replace(/[^A-Z0-9]/gi, '').toUpperCase();
  };

  const validateProcedureCode = (code: string): boolean => {
    if (!code) return true;
    const procedureCodeRegex = /^[A-Z]\d{4,5}$/;
    return procedureCodeRegex.test(code);
  };

  const handleCodeChange = async (index: number, value: string) => {
    const formattedCode = formatProcedureCode(value);
    const newCodes = [...codes];
    newCodes[index] = formattedCode;
    setCodes(newCodes);

    const isValid = validateProcedureCode(formattedCode);
    const newValidations = [...validations];
    newValidations[index] = isValid;
    setValidations(newValidations);

    if (debounceTimers[index]) {
      clearTimeout(debounceTimers[index]);
    }

    if (!autoSave || !formattedCode || !isValid) return;

    const newTimers = [...debounceTimers];
    newTimers[index] = setTimeout(async () => {
      try {
        setError(null);
        const { error: saveError } = await supabase
          .from('procedure_codes')
          .upsert([{ code: formattedCode }], {
            onConflict: 'code'
          });

        if (saveError) throw saveError;

        toast({
          title: "Success",
          description: `Procedure code ${formattedCode} saved`,
          duration: 2000,
        });

        const validCodes = newCodes.filter((code, i) => code && newValidations[i]);
        if (validCodes.length > 0) {
          onValidate(validCodes);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to save procedure code';
        setError(message);
        toast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    }, 1000);
    setDebounceTimers(newTimers);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (event.key === 'Enter' && validateProcedureCode(codes[index])) {
      const nextIndex = Math.min(index + 1, 4);
      document.getElementById(`code-${nextIndex}`)?.focus();
    } else if (event.key === 'ArrowDown' || (event.key === 'Tab' && !event.shiftKey)) {
      event.preventDefault();
      const nextIndex = Math.min(index + 1, 4);
      document.getElementById(`code-${nextIndex}`)?.focus();
    } else if (event.key === 'ArrowUp' || (event.key === 'Tab' && event.shiftKey)) {
      event.preventDefault();
      const prevIndex = Math.max(index - 1, 0);
      document.getElementById(`code-${prevIndex}`)?.focus();
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
    <Card className="p-4" role="form" aria-label="Procedure Code Entry Form">
      <div className="space-y-4">
        <CodeHeader 
          autoSave={autoSave}
          onAutoSaveChange={setAutoSave}
          showValidation={showValidation}
          onShowValidationChange={setShowValidation}
        />
        {error && (
          <div 
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded" 
            role="alert"
            aria-live="polite"
          >
            <p className="text-sm">{error}</p>
          </div>
        )}
        <div 
          className="grid grid-cols-1 md:grid-cols-5 gap-4" 
          role="group" 
          aria-labelledby="procedure-codes-heading"
        >
          {codes.map((code, index) => (
            <CodeInput
              key={index}
              code={code}
              onChange={(value) => handleCodeChange(index, value)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              isLoading={isLoading}
              error={error}
              validationResult={validations[index] ? 
                { isValid: true, message: "Valid code" } : 
                { isValid: false, message: "Invalid code format" }
              }
              showValidation={showValidation}
              id={`code-${index}`}
              placeholder={`Code ${index + 1}`}
              aria-label={`Procedure code ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default ProcedureCodeValidator;
