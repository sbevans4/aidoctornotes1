
import React from "react";
import { Helmet } from "react-helmet";
import SecurityDashboard from "@/components/security/SecurityDashboard";
import { complianceRequirements } from "@/data/complianceRequirements";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const SecurityDashboardPage = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isAuthenticated === null) {
    // Loading state
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-primary"></div>
      </div>
    );
  }

  if (isAuthenticated === false) {
    return (
      <div className="container mx-auto px-4 py-20">
        <div className="text-center max-w-lg mx-auto">
          <h1 className="text-3xl font-bold mb-6">Security Dashboard</h1>
          <p className="mb-8">Please sign in to access your security dashboard</p>
          <Button onClick={() => navigate("/auth")}>Sign In</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Security Dashboard | ConvoNotes Genius</title>
        <meta name="description" content="Track compliance with healthcare security standards and manage your HIPAA compliance requirements." />
      </Helmet>

      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security Dashboard</h1>
          <p className="text-gray-600">
            Track your compliance with healthcare security standards and manage your HIPAA requirements.
          </p>
        </div>

        <SecurityDashboard complianceItems={complianceRequirements} />
      </div>
    </>
  );
};

export default SecurityDashboardPage;
