
import React from 'react';
import { Settings } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export interface ValidationSettingsProps {
  autoSave: boolean;
  onAutoSaveChange: (enabled: boolean) => void;
  showValidation: boolean;
  onShowValidationChange: (enabled: boolean) => void;
}

const ValidationSettings = ({
  autoSave,
  onAutoSaveChange,
  showValidation,
  onShowValidationChange,
}: ValidationSettingsProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Open validation settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Validation Settings</h4>
            <p className="text-sm text-muted-foreground">
              Configure how procedure codes are validated and saved
            </p>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="auto-save" className="flex flex-col space-y-1">
                <span>Auto-save</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Automatically save valid codes
                </span>
              </Label>
              <Switch
                id="auto-save"
                checked={autoSave}
                onCheckedChange={onAutoSaveChange}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="show-validation" className="flex flex-col space-y-1">
                <span>Show validation</span>
                <span className="font-normal text-xs text-muted-foreground">
                  Display real-time validation feedback
                </span>
              </Label>
              <Switch
                id="show-validation"
                checked={showValidation}
                onCheckedChange={onShowValidationChange}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ValidationSettings;
