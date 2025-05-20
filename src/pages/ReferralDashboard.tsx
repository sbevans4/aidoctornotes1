
import React from "react";
import { Helmet } from "react-helmet";
import { ReferralSection } from "@/components/services/therapy-notes/ReferralSection";
import { ReferralDocumentation } from "@/components/referrals/ReferralDocumentation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ReferralDashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Redirect to auth if not authenticated
  if (!isLoading && !isAuthenticated) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <>
      <Helmet>
        <title>Referral Program | AIDoctorNotes</title>
        <meta name="description" content="Invite colleagues and earn rewards through our referral program." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Referral Program Dashboard</h1>
        
        <Tabs defaultValue="program" className="mb-8">
          <TabsList className="mb-4 mx-auto flex justify-center md:justify-start">
            <TabsTrigger value="program">Referral Program</TabsTrigger>
            <TabsTrigger value="documentation">How It Works</TabsTrigger>
          </TabsList>
          
          <TabsContent value="program">
            <ReferralSection />
          </TabsContent>
          
          <TabsContent value="documentation">
            <ReferralDocumentation />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ReferralDashboard;
