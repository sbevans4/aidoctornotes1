import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  Stethoscope,
  ClipboardEdit,
  Calculator,
  ShieldCheck,
} from "lucide-react";

interface RoleSelectionProps {
  onRoleSelected: () => void;
}

const roles = [
  {
    id: "physician",
    label: "Physician",
    icon: Stethoscope,
    description: "Primary care doctors and specialists",
  },
  {
    id: "scribe",
    label: "Medical Scribe",
    icon: ClipboardEdit,
    description: "Documentation specialists and assistants",
  },
  {
    id: "coder",
    label: "Medical Coder",
    icon: Calculator,
    description: "Billing and coding professionals",
  },
  {
    id: "admin",
    label: "Administrator",
    icon: ShieldCheck,
    description: "Practice managers and supervisors",
  },
];

const RoleSelection = ({ onRoleSelected }: RoleSelectionProps) => {
  const [selectedRole, setSelectedRole] = useState<string>("");

  const handleContinue = () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "You must select a role to continue",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Role selected",
      description: `You have selected the ${selectedRole} role`,
    });
    onRoleSelected();
  };

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Select Your Role</h2>
      <RadioGroup
        value={selectedRole}
        onValueChange={setSelectedRole}
        className="grid gap-4"
      >
        {roles.map(({ id, label, icon: Icon, description }) => (
          <div
            key={id}
            className={`flex items-start space-x-4 border rounded-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedRole === id ? "border-medical-primary bg-medical-light" : ""
            }`}
            onClick={() => setSelectedRole(id)}
          >
            <RadioGroupItem value={id} id={id} className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-medical-primary" />
                <Label htmlFor={id} className="text-lg font-medium">
                  {label}
                </Label>
              </div>
              <p className="text-gray-600 mt-1">{description}</p>
            </div>
          </div>
        ))}
      </RadioGroup>
      <Button
        className="w-full mt-6"
        onClick={handleContinue}
        disabled={!selectedRole}
      >
        Continue
      </Button>
    </Card>
  );
};

export default RoleSelection;