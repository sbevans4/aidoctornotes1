import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PersonalizationSettings = () => {
  const [autoTranscribe, setAutoTranscribe] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const handleSettingChange = (setting: string, value: boolean) => {
    switch (setting) {
      case "autoTranscribe":
        setAutoTranscribe(value);
        break;
      case "darkMode":
        setDarkMode(value);
        break;
      case "autoSave":
        setAutoSave(value);
        break;
    }
    
    toast({
      title: "Setting Updated",
      description: `${setting} has been ${value ? 'enabled' : 'disabled'}`,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center justify-center gap-2">
          <Settings className="w-4 h-4" />
          Personalization Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Personalization Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-transcribe" className="text-right">
              Auto-transcribe recordings
            </Label>
            <Switch
              id="auto-transcribe"
              checked={autoTranscribe}
              onCheckedChange={(checked) => handleSettingChange("autoTranscribe", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="text-right">
              Dark mode
            </Label>
            <Switch
              id="dark-mode"
              checked={darkMode}
              onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="auto-save" className="text-right">
              Auto-save notes
            </Label>
            <Switch
              id="auto-save"
              checked={autoSave}
              onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonalizationSettings;