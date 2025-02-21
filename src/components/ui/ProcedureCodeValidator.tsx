
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { CodeHeader } from "./procedure-codes/CodeHeader";
import { CodeInput } from "./procedure-codes/CodeInput";
import { ValidationSettings } from "./procedure-codes/ValidationSettings";

export function ProcedureCodeValidator() {
  const [autoSave, setAutoSave] = useState(true);
  const [showValidation, setShowValidation] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    message?: string;
  } | null>(null);

  useEffect(() => {
    if (autoSave && code) {
      validateCode();
    }
  }, [code, autoSave]);

  const validateCode = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: dbError } = await supabase
        .from("procedure_codes")
        .select("*")
        .eq("code", code)
        .single();

      if (dbError) {
        throw new Error("Failed to validate code");
      }

      setValidationResult({
        isValid: !!data,
        message: data ? "Valid procedure code" : "Invalid procedure code",
      });

      if (!data) {
        toast({
          title: "Invalid Code",
          description: "Please enter a valid procedure code",
          variant: "destructive",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) {
      toast({
        title: "Error",
        description: "Please enter a procedure code",
        variant: "destructive",
      });
      return;
    }
    validateCode();
  };

  return (
    <Card className="p-6 space-y-6">
      <CodeHeader 
        autoSave={autoSave}
        onAutoSaveChange={setAutoSave}
        showValidation={showValidation}
        onShowValidationChange={setShowValidation}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        <CodeInput
          code={code}
          onChange={setCode}
          isLoading={isLoading}
          error={error}
          validationResult={validationResult}
          showValidation={showValidation}
        />

        <ValidationSettings
          autoSave={autoSave}
          onAutoSaveChange={setAutoSave}
          showValidation={showValidation}
          onShowValidationChange={setShowValidation}
        />
      </form>
    </Card>
  );
}
