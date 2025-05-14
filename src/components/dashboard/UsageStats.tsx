
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UsageStatsProps {
  isLoading: boolean;
}

export const UsageStats = ({ isLoading }: UsageStatsProps) => {
  const [usage, setUsage] = useState({
    recordingsThisMonth: 0,
    recordingsLimit: 100,
    transcriptionMinutesUsed: 0,
    transcriptionMinutesLimit: 60,
    imagesProcessed: 0,
    imagesLimit: 50
  });

  useEffect(() => {
    const fetchUsageStats = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // In a real app, we'd fetch actual usage data from Supabase
        // For now, we'll mock the data
        const { data: analyticsData } = await supabase
          .from('analytics')
          .select('*')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        // If we have real data, process it here
        if (analyticsData?.metrics) {
          // This would parse the metrics JSON and set appropriate values
          // setUsage({ ...usage, ...processedData });
        }
      } catch (error) {
        console.error('Error fetching usage stats:', error);
      }
    };

    if (!isLoading) {
      fetchUsageStats();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
        <div className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Usage Statistics</h2>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Recordings this month</span>
            <span className="text-sm text-gray-500">
              {usage.recordingsThisMonth} / {usage.recordingsLimit}
            </span>
          </div>
          <Progress 
            value={(usage.recordingsThisMonth / usage.recordingsLimit) * 100} 
            className="h-2" 
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Transcription minutes</span>
            <span className="text-sm text-gray-500">
              {usage.transcriptionMinutesUsed} / {usage.transcriptionMinutesLimit}
            </span>
          </div>
          <Progress 
            value={(usage.transcriptionMinutesUsed / usage.transcriptionMinutesLimit) * 100} 
            className="h-2" 
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Images Analyzed</span>
            <span className="text-sm text-gray-500">
              {usage.imagesProcessed} / {usage.imagesLimit}
            </span>
          </div>
          <Progress 
            value={(usage.imagesProcessed / usage.imagesLimit) * 100} 
            className="h-2" 
          />
        </div>
      </div>
    </Card>
  );
};
