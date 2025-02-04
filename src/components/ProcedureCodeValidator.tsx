import { toast } from "@/hooks/use-toast";

interface ProcedureCodeValidatorProps {
  onValidate: (codes: string[]) => void;
}

const ProcedureCodeValidator = ({ onValidate }: ProcedureCodeValidatorProps) => {
  const validateProcedureCodes = () => {
    const codes = Array.from(document.querySelectorAll('input[placeholder^="Code"]'))
      .map((input) => (input as HTMLInputElement).value)
      .filter(Boolean);

    if (codes.length === 0) {
      toast({
        title: "Warning",
        description: "No procedure codes entered. This may affect documentation compliance.",
        variant: "destructive",
      });
    }

    onValidate(codes);
  };

  return null; // This is a logic-only component
};

export default ProcedureCodeValidator;