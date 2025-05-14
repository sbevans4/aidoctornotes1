
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UsageStats } from "@/components/dashboard/UsageStats";
import { RoleSelection } from "@/components/RoleSelection";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentNotes, setRecentNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { currentSubscription } = useSubscription();

  useEffect(() => {
    const fetchRecentNotes = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate("/auth");
          return;
        }

        const { data, error } = await supabase
          .from("clinical_notes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (error) throw error;
        setRecentNotes(data || []);
      } catch (error) {
        console.error("Error fetching recent notes:", error);
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
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Welcome to ConvoNotes Genius</h1>
        <p className="text-gray-600 mt-1">
          Your AI-powered medical documentation assistant
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RoleSelection />

          <UsageStats isLoading={isLoading} />
          
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Get Started</h2>
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
