
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle } from "lucide-react";

interface CodeInputProps {
  code: string;
  index: number;
  isValid: boolean;
  isFocused: boolean;
  onChange: (index: number, value: string) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
}

const CodeInput: React.FC<CodeInputProps> = ({
  code,
  index,
  isValid,
  isFocused,
  onChange,
  onKeyDown,
  onFocus,
  onBlur,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={`code-${index}`} className="sr-only">
        Procedure Code {index + 1}
      </Label>
      <div className="relative">
        <Input
          id={`code-${index}`}
          placeholder={`Code ${index + 1}`}
          value={code}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(e, index)}
          onFocus={() => onFocus(index)}
          onBlur={onBlur}
          className={`w-full pr-8 ${
            !isValid && code ? 'border-red-500 focus-visible:ring-red-500' : 
            code && isValid ? 'border-green-500 focus-visible:ring-green-500' : ''
          } ${isFocused ? 'ring-2 ring-offset-2' : ''}`}
          aria-invalid={!isValid}
          aria-describedby={!isValid ? `error-${index}` : undefined}
          maxLength={6}
        />
        {code && (
          <div 
            className="absolute right-2 top-1/2 -translate-y-1/2"
            aria-hidden="true"
          >
            {isValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {!isValid && code && (
        <p 
          id={`error-${index}`} 
          className="text-sm text-red-500"
          role="alert"
        >
          Invalid format: must be one letter followed by 4-5 digits
        </p>
      )}
    </div>
  );
};

export default CodeInput;
