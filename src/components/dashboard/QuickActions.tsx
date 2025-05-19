
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, CreditCard, ImageIcon, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PersonalizationSettings from "@/components/PersonalizationSettings";
import { useState, useEffect } from "react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface QuickActionsProps {
  currentSubscription: any;
}

export const QuickActions = ({ currentSubscription }: QuickActionsProps) => {
  const navigate = useNavigate();
  const [canUseImageAnalysis, setCanUseImageAnalysis] = useState<boolean | null>(null);
  const { checkFeatureAccess } = useSubscription();
  
  useEffect(() => {
    const checkAccess = async () => {
      try {
        // First check for unlimited_image_analysis (Image Analysis tier)
        let hasAccess = await checkFeatureAccess("unlimited_image_analysis");
        
        // If not, check for limited_image_analysis (Unlimited/Professional tiers)
        if (!hasAccess) {
          hasAccess = await checkFeatureAccess("limited_image_analysis");
        }
        
        setCanUseImageAnalysis(hasAccess);
      } catch (error) {
        console.error("Error checking feature access:", error);
        setCanUseImageAnalysis(false);
      }
    };
    
    checkAccess();
  }, [checkFeatureAccess, currentSubscription]);

  const handleImageAnalysisClick = () => {
    if (canUseImageAnalysis) {
      navigate("/medical-documentation?tab=image");
    } else {
      toast({
        title: "Feature not available",
        description: "Image analysis requires Unlimited, Professional or Image Analysis subscription",
        variant: "destructive",
      });
      navigate("/subscription-plans");
    }
  };

  const getPlanText = () => {
    if (!currentSubscription) return "Choose a Plan";
    
    // Get the days left in subscription
    const endDate = new Date(currentSubscription.current_period_end);
    const today = new Date();
    const daysLeft = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    return `${daysLeft} days left on ${currentSubscription.subscription_plans?.name}`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="space-y-4">
        <Button 
          className="w-full flex items-center justify-center gap-2" 
          variant="outline"
          onClick={() => navigate("/medical-documentation")}
        >
          <Mic className="w-4 h-4" />
          Start New Recording
        </Button>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button 
                  className="w-full flex items-center justify-center gap-2" 
                  variant="outline"
                  onClick={handleImageAnalysisClick}
                  disabled={canUseImageAnalysis === null}
                >
                  <ImageIcon className="w-4 h-4" />
                  Image Analysis 
                  {canUseImageAnalysis === false && (
                    <AlertCircle className="w-3.5 h-3.5 ml-1 text-amber-500" />
                  )}
                </Button>
              </div>
            </TooltipTrigger>
            {canUseImageAnalysis === false && (
              <TooltipContent>
                <p>Requires Unlimited, Professional or Image Analysis subscription</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        
        <PersonalizationSettings />
        
        <Button
          className="w-full flex items-center justify-center gap-2"
          variant="outline"
          onClick={() => navigate("/subscription-plans")}
        >
          <CreditCard className="w-4 h-4" />
          {currentSubscription ? getPlanText() : "Choose a Plan"}
        </Button>
      </div>
    </Card>
  );
};
