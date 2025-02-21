
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface ValidationSettingsProps {
  autoSave: boolean;
  onAutoSaveChange: (value: boolean) => void;
  showValidation: boolean;
  onShowValidationChange: (value: boolean) => void;
}

export function ValidationSettings({
  autoSave,
  onAutoSaveChange,
  showValidation,
  onShowValidationChange,
}: ValidationSettingsProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="autoSave">Auto-validate on change</Label>
        <Switch
          id="autoSave"
          checked={autoSave}
          onCheckedChange={onAutoSaveChange}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="showValidation">Show validation results</Label>
        <Switch
          id="showValidation"
          checked={showValidation}
          onCheckedChange={onShowValidationChange}
        />
      </div>
    </div>
  );
}
