
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CodeInputProps {
  code: string;
  onChange: (value: string) => void;
  isLoading: boolean;
  error: string | null;
  validationResult: {
    isValid: boolean;
    message?: string;
  } | null;
  showValidation: boolean;
}

export function CodeInput({
  code,
  onChange,
  isLoading,
  error,
  validationResult,
  showValidation,
}: CodeInputProps) {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter procedure code"
          value={code}
          onChange={(e) => onChange(e.target.value.toUpperCase())}
          disabled={isLoading}
          className="font-mono"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Validate"
          )}
        </Button>
      </div>

      {showValidation && validationResult && (
        <Alert
          variant={validationResult.isValid ? "default" : "destructive"}
          className="flex items-center"
        >
          {validationResult.isValid ? (
            <Check className="h-4 w-4 text-green-500" />
          ) : (
            <X className="h-4 w-4 text-red-500" />
          )}
          <AlertDescription className="ml-2">
            {validationResult.message}
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
