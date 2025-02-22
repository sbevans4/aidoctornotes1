
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CodeInputProps {
  code: string;
  onChange: (value: string) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  error: string | null;
  validationResult: {
    isValid: boolean;
    message?: string;
  } | null;
  showValidation: boolean;
  id?: string;
  placeholder?: string;
  "aria-label"?: string;
}

export function CodeInput({
  code,
  onChange,
  onKeyDown,
  isLoading,
  error,
  validationResult,
  showValidation,
  id,
  placeholder,
  "aria-label": ariaLabel,
}: CodeInputProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          placeholder={placeholder}
          value={code}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={isLoading}
          className="font-mono pr-8"
          aria-label={ariaLabel}
          aria-invalid={validationResult ? !validationResult.isValid : undefined}
        />
        {showValidation && validationResult && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {validationResult.isValid ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <X className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>

      {showValidation && validationResult && !validationResult.isValid && (
        <Alert
          variant="destructive"
          className="py-2 px-3"
          role="alert"
          aria-live="polite"
        >
          <AlertDescription className="text-xs">
            {validationResult.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
