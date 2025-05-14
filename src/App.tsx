
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "./integrations/supabase/client";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import Index from "./pages/Index";
import MedicalDocumentation from "./pages/MedicalDocumentation";
import NotFound from "./pages/NotFound";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import Auth from "./pages/Auth";
import Enterprise from "./pages/Enterprise";
import Services from "./pages/Services";
import AIDoctorNotes from "./pages/Services/AIDoctorNotes";
import AITherapyNotes from "./pages/Services/AITherapyNotes";
import AIMedicalTranscription from "./pages/Services/AIMedicalTranscription";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Security from "./pages/Security";
import SecurityDashboard from "./pages/SecurityDashboard";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";

// Create a client
const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (session === null) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return session ? <>{children}</> : <Navigate to="/auth" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Index />
                </Layout>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/enterprise"
              element={
                <Layout>
                  <Enterprise />
                </Layout>
              }
            />
            
            {/* Services Pages */}
            <Route
              path="/services"
              element={
                <Layout>
                  <Services />
                </Layout>
              }
            />
            <Route
              path="/services/ai-doctor-notes"
              element={
                <Layout>
                  <AIDoctorNotes />
                </Layout>
              }
            />
            <Route
              path="/services/ai-therapy-notes"
              element={
                <Layout>
                  <AITherapyNotes />
                </Layout>
              }
            />
            <Route
              path="/services/ai-medical-transcription"
              element={
                <Layout>
                  <AIMedicalTranscription />
                </Layout>
              }
            />
            
            {/* Blog Routes */}
            <Route
              path="/blog"
              element={
                <Layout>
                  <Blog />
                </Layout>
              }
            />
            <Route
              path="/blog/:slug"
              element={
                <Layout>
                  <BlogPost />
                </Layout>
              }
            />
            
            {/* Security Pages */}
            <Route
              path="/security"
              element={
                <Layout>
                  <Security />
                </Layout>
              }
            />
            <Route
              path="/security/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <SecurityDashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <Layout>
                  <Contact />
                </Layout>
              }
            />
            
            {/* Private Routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/medical-documentation"
              element={
                <PrivateRoute>
                  <Layout>
                    <MedicalDocumentation />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/subscription-plans"
              element={
                <PrivateRoute>
                  <Layout>
                    <SubscriptionPlans />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <UserProfile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
