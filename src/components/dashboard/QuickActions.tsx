import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PersonalizationSettings from "@/components/PersonalizationSettings";

interface QuickActionsProps {
  currentSubscription: any;
}

export const QuickActions = ({ currentSubscription }: QuickActionsProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <Button className="w-full flex items-center justify-center gap-2" variant="outline">
          <Mic className="w-4 h-4" />
          Start New Recording
        </Button>
        <PersonalizationSettings />
        <Button
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
          onClick={() => navigate("/subscription-plans")}
        >
          <CreditCard className="w-4 h-4" />
          {currentSubscription ? "Manage Subscription" : "Choose a Plan"}
        </Button>
      </div>
    </Card>
  );
};