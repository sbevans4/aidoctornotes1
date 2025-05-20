
import React from "react";
import { Helmet } from "react-helmet";
import { ReferralAdminPanel } from "@/components/admin/ReferralAdminPanel";
import { ReferralABTestingPanel } from "@/components/admin/ReferralABTestingPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const ReferralAdmin = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const isAdmin = user?.user_metadata?.is_admin || false;
  
  // Redirect to dashboard if not authenticated or not admin
  if (!isLoading && (!isAuthenticated || !isAdmin)) {
    return <Navigate to="/dashboard" />;
  }
  
  return (
    <>
      <Helmet>
        <title>Referral Administration | AIDoctorNotes</title>
        <meta name="description" content="Admin panel for managing the referral program" />
      </Helmet>
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Referral Program Administration</h1>
        
        <Tabs defaultValue="manage" className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="manage">Manage Referrals</TabsTrigger>
            <TabsTrigger value="abtesting">A/B Testing</TabsTrigger>
            <TabsTrigger value="analytics">Advanced Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="manage">
            <ReferralAdminPanel />
          </TabsContent>
          
          <TabsContent value="abtesting">
            <ReferralABTestingPanel />
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="p-8 text-center">
              <p className="text-gray-500">Advanced Analytics Coming Soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ReferralAdmin;
