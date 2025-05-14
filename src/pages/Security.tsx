
import React from "react";
import { Helmet } from "react-helmet";
import { supabase } from "@/integrations/supabase/client";
import HeroBanner from "@/components/security/HeroBanner";
import SecurityStatusCard from "@/components/security/SecurityStatusCard";
import SecurityFeatures from "@/components/security/SecurityFeatures";
import DocumentSecurityInfo from "@/components/security/DocumentSecurityInfo";
import HipaaCompliance from "@/components/security/HipaaCompliance";
import Certifications from "@/components/security/Certifications";
import SecurityWhitepaper from "@/components/security/SecurityWhitepaper";

const Security = () => {
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

  return (
    <>
      <Helmet>
        <title>Security & Compliance | ConvoNotes Genius</title>
        <meta name="description" content="HIPAA-compliant security measures and data protection protocols for healthcare documentation. Learn how we safeguard your patient information." />
        <meta property="og:title" content="Security & Compliance | ConvoNotes Genius" />
        <meta property="og:description" content="HIPAA-compliant security measures and data protection protocols for healthcare documentation." />
      </Helmet>

      <div className="pt-20">
        <HeroBanner isAuthenticated={isAuthenticated} />
        <SecurityStatusCard isAuthenticated={isAuthenticated} />
        <SecurityFeatures />
        <DocumentSecurityInfo />
        <HipaaCompliance />
        <Certifications />
        <SecurityWhitepaper isAuthenticated={isAuthenticated} />
      </div>
    </>
  );
};

export default Security;
