
interface CodeHeaderProps {
  autoSave: boolean;
  onAutoSaveChange: (value: boolean) => void;
  showValidation: boolean;
  onShowValidationChange: (value: boolean) => void;
}

export function CodeHeader({
  autoSave,
  onAutoSaveChange,
  showValidation,
  onShowValidationChange,
}: CodeHeaderProps) {
  return (
    <div className="space-y-2">
      <h2 className="text-2xl font-bold tracking-tight">Procedure Code Validator</h2>
      <p className="text-muted-foreground">
        Enter a procedure code to validate it against our database.
      </p>
    </div>
  );
}
