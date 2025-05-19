
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, TrendingUp, Clock } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface UsageStatsCardProps {
  isLoading: boolean;
  currentSubscription: any;
}

export const UsageStatsCard = ({ isLoading, currentSubscription }: UsageStatsCardProps) => {
  const [usage, setUsage] = useState({
    recordingsThisMonth: 0,
    recordingsLimit: 100,
    notesThisMonth: 0,
    notesLimit: 5,
    transcriptionMinutesUsed: 0,
    transcriptionMinutesLimit: 60,
    imagesProcessed: 0,
    imagesLimit: 5
  });
  
  const { checkFeatureAccess } = useSubscription();
  const [hasUnlimitedNotes, setHasUnlimitedNotes] = useState(false);
  const [hasUnlimitedTranscription, setHasUnlimitedTranscription] = useState(false);
  const [hasUnlimitedImageAnalysis, setHasUnlimitedImageAnalysis] = useState(false);

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Check if user has unlimited features
        const unlimitedNotes = await checkFeatureAccess("unlimited_soap_notes");
        setHasUnlimitedNotes(unlimitedNotes);
        
        const unlimitedTranscription = await checkFeatureAccess("unlimited_transcription");
        setHasUnlimitedTranscription(unlimitedTranscription);
        
        const unlimitedImageAnalysis = await checkFeatureAccess("unlimited_image_analysis");
        setHasUnlimitedImageAnalysis(unlimitedImageAnalysis);

        // In a real app, we'd fetch actual usage data from Supabase
        const { data: usageData } = await supabase
          .from('analytics')
          .select('metrics')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Mock usage data - in a real app, this would come from usageData
        setUsage({
          recordingsThisMonth: 14,
          recordingsLimit: 100,
          notesThisMonth: 4,
          notesLimit: hasUnlimitedNotes ? Infinity : 5,
          transcriptionMinutesUsed: 45,
          transcriptionMinutesLimit: hasUnlimitedTranscription ? Infinity : 60,
          imagesProcessed: 3,
          imagesLimit: hasUnlimitedImageAnalysis ? Infinity : 5
        });
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      }
    };

    if (!isLoading) {
      fetchUsageStats();
    }
  }, [isLoading, checkFeatureAccess, hasUnlimitedNotes, hasUnlimitedTranscription, hasUnlimitedImageAnalysis]);

  const renderProgressBar = (used: number, limit: number, label: string, isNearLimit: boolean) => {
    // Check if this feature is unlimited
    if (limit === Infinity) {
      return (
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">{label}</span>
            <span className="text-sm text-gray-500">Unlimited</span>
          </div>
          <div className="h-2 bg-gray-100 rounded">
            <div className="h-full rounded bg-blue-200" style={{ width: '100%' }}></div>
          </div>
        </div>
      );
    }

    const percentage = (used / limit) * 100;
    const colorClass = isNearLimit ? "bg-amber-500" : percentage >= 90 ? "bg-red-500" : "bg-green-500";

    return (
      <div>
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">{label}</span>
          <span className="text-sm text-gray-500">
            {used} / {limit}
          </span>
        </div>
        <Progress 
          value={percentage} 
          className="h-2" 
          indicatorClassName={colorClass}
        />
        {isNearLimit && (
          <div className="mt-1 flex items-center text-amber-500 text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            <span>Approaching limit. Consider upgrading.</span>
          </div>
        )}
      </div>
    );
  };

  const getPlanTier = () => {
    if (!currentSubscription?.subscription_plans?.tier) return 'trial';
    return currentSubscription.subscription_plans.tier;
  };

  const shouldShowUpgradeNudge = () => {
    // Show nudge if using basic plan or approaching limits
    const tier = getPlanTier();
    if (tier === 'basic' || tier === 'trial') return true;
    if (tier === 'unlimited' && usage.imagesProcessed / usage.imagesLimit > 0.7) return true;
    return false;
  };

  const getUpgradeMessage = () => {
    const tier = getPlanTier();
    if (tier === 'basic' || tier === 'trial') {
      return "Upgrade to Standard for unlimited SOAP notes and transcription!";
    }
    if (tier === 'standard') {
      return "Upgrade to Unlimited for image analysis capabilities!";
    }
    if (tier === 'unlimited') {
      return "Upgrade to Professional for team accounts and EHR integration!";
    }
    return "Upgrade to unlock more features!";
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
        <div className="space-y-6">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Usage Statistics</h2>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span>This Month</span>
        </div>
      </div>
      
      <div className="space-y-6">
        {!hasUnlimitedTranscription && renderProgressBar(
          usage.transcriptionMinutesUsed, 
          usage.transcriptionMinutesLimit, 
          "Transcription minutes", 
          usage.transcriptionMinutesUsed / usage.transcriptionMinutesLimit > 0.8
        )}
        
        {!hasUnlimitedNotes && renderProgressBar(
          usage.notesThisMonth, 
          usage.notesLimit, 
          "SOAP notes", 
          usage.notesThisMonth / usage.notesLimit > 0.8
        )}
        
        {(getPlanTier() === 'unlimited' || getPlanTier() === 'professional' || getPlanTier() === 'image_analysis') && 
          renderProgressBar(
            usage.imagesProcessed, 
            usage.imagesLimit, 
            "Images Analyzed", 
            usage.imagesProcessed / usage.imagesLimit > 0.8
          )
        }
      </div>
      
      {shouldShowUpgradeNudge() && (
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start">
            <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
            <div>
              <p className="text-sm font-medium text-blue-800">{getUpgradeMessage()}</p>
              <Button 
                size="sm" 
                className="mt-2"
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Plans
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
