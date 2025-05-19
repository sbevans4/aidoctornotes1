
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UsageStats } from "@/components/dashboard/UsageStats";
import { UsageStatsCard } from "@/components/dashboard/UsageStatsCard";
import RoleSelection from "@/components/RoleSelection";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { FileText, Clock, AlertCircle, Gift } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentSubscription } = useSubscription();
  const [stats, setStats] = useState({
    totalNotes: 0,
    completedNotes: 0,
    pendingNotes: 0
  });
  const [showTrialBanner, setShowTrialBanner] = useState(true);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("clinical_notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentNotes(data || []);

        // Calculate stats
        const { data: statsData, error: statsError } = await supabase
          .from("clinical_notes")
          .select("id, status")
          .eq("user_id", user.id);

        if (statsError) throw statsError;

        const totalNotes = statsData?.length || 0;
        const completedNotes = statsData?.filter(n => n.status === "completed").length || 0;
        const pendingNotes = statsData?.filter(n => n.status === "draft").length || 0;

        setStats({
          totalNotes,
          completedNotes,
          pendingNotes
        });

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load your recent notes",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentNotes();
  }, [user]);

  const getPlanTier = () => {
    if (!currentSubscription?.subscription_plans?.tier) return 'basic';
    return currentSubscription.subscription_plans.tier;
  };

  const handleCreateNewNote = () => {
    navigate("/medical-documentation");
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-56 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}</h1>
        <p className="text-gray-600 mt-1">
          Your AI-powered medical documentation assistant
        </p>
      </div>

      {/* Trial Banner */}
      {getPlanTier() === 'basic' && showTrialBanner && (
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Gift className="h-5 w-5 text-blue-500 mr-2" />
              <div>
                <p className="font-medium text-blue-800">Try Professional free for 7 days!</p>
                <p className="text-sm text-blue-600">Experience unlimited SOAP notes, team accounts, and more.</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm"
                onClick={() => navigate("/subscription-plans")}
              >
                Start Trial
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowTrialBanner(false)}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-blue-100 p-3 mb-2">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-medium">Total Notes</h3>
              <p className="text-2xl font-bold">{stats.totalNotes}</p>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-green-100 p-3 mb-2">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-medium">Completed</h3>
              <p className="text-2xl font-bold">{stats.completedNotes}</p>
            </Card>
            <Card className="p-6 flex flex-col items-center justify-center">
              <div className="rounded-full bg-amber-100 p-3 mb-2">
                <AlertCircle className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-medium">Pending</h3>
              <p className="text-2xl font-bold">{stats.pendingNotes}</p>
            </Card>
          </div>
          
          <RoleSelection onRoleSelected={() => {}} />

          {/* Replace the old UsageStats with our new enhanced UsageStatsCard */}
          <UsageStatsCard isLoading={isLoading} currentSubscription={currentSubscription} />
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Get Started</h2>
              <Button onClick={handleCreateNewNote}>Create New Note</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div 
                onClick={() => navigate("/medical-documentation")}
                className="flex flex-col items-center justify-center p-6 bg-blue-50 rounded-lg cursor-pointer hover:bg-blue-100 transition"
              >
                <div className="h-12 w-12 bg-blue-500 text-white rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">🎙️</span>
                </div>
                <h3 className="font-medium text-lg">Voice Recording</h3>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Record patient interactions and generate SOAP notes
                </p>
              </div>
              
              <div 
                onClick={() => navigate("/medical-documentation")}
                className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-lg cursor-pointer hover:bg-green-100 transition"
              >
                <div className="h-12 w-12 bg-green-500 text-white rounded-full flex items-center justify-center mb-3">
                  <span className="text-2xl">📷</span>
                </div>
                <h3 className="font-medium text-lg">Image Analysis</h3>
                <p className="text-center text-sm text-gray-500 mt-2">
                  Upload and analyze medical images
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <QuickActions currentSubscription={currentSubscription} />
          <RecentActivity recentNotes={recentNotes} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
