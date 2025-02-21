
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function EnterpriseCTA() {
  const navigate = useNavigate();

  return (
    <div className="text-center">
      <Button
        variant="outline"
        className="flex items-center gap-2"
        onClick={() => navigate("/enterprise")}
      >
        <Building2 className="h-4 w-4" />
        Looking for Enterprise plans?
      </Button>
    </div>
  );
}

