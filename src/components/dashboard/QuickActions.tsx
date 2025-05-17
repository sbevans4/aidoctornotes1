
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, CreditCard, ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PersonalizationSettings from "@/components/PersonalizationSettings";
import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

interface QuickActionsProps {
  currentSubscription: any;
}

export const QuickActions = ({ currentSubscription }: QuickActionsProps) => {
  const navigate = useNavigate();
  const [canUseImageAnalysis, setCanUseImageAnalysis] = useState(false);
  const { checkFeatureAccess } = useSubscription();
  
  useEffect(() => {
    const checkAccess = async () => {
      const hasAccess = await checkFeatureAccess("image_analysis");
      setCanUseImageAnalysis(hasAccess);
    };
    checkAccess();
  }, [checkFeatureAccess]);

  const handleImageAnalysisClick = () => {
    if (canUseImageAnalysis) {
      navigate("/medical-documentation?tab=image");
    } else {
      toast({
        title: "Feature not available",
        description: "Image analysis requires an Enterprise subscription",
        variant: "destructive",
      });
      navigate("/subscription-plans");
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <Button className="w-full flex items-center justify-center gap-2" variant="outline"
           onClick={() => navigate("/medical-documentation")}>
          <Mic className="w-4 h-4" />
          Start New Recording
        </Button>
        
        <Button className="w-full flex items-center justify-center gap-2" variant="outline"
           onClick={handleImageAnalysisClick}>
          <ImageIcon className="w-4 h-4" />
          Image Analysis {!canUseImageAnalysis && "(Enterprise)"}
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
