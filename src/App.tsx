
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./routes/PrivateRoute";

// Pages
import Index from "./pages/Index";
import Enterprise from "./pages/Enterprise";
import Auth from "./pages/Auth";
import ForgotPassword from "./pages/ForgotPassword";
import PasswordReset from "./pages/PasswordReset";
import EmailVerification from "./pages/EmailVerification";
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
import MedicalDocumentation from "./pages/MedicalDocumentation";
import SubscriptionPlans from "./pages/SubscriptionPlans";
import UserProfile from "./pages/UserProfile";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCanceled from "./pages/PaymentCanceled";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Main Routes */}
            <Route
              path="/"
              element={
                <Layout>
                  <Index />
                </Layout>
              }
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/reset-password" element={<PasswordReset />} />
            <Route path="/auth/verify" element={<EmailVerification />} />
            <Route
              path="/enterprise"
              element={
                <Layout>
                  <Enterprise />
                </Layout>
              }
            />
            
            {/* Service Routes */}
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
            
            {/* Security Routes */}
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
            
            {/* Authenticated Routes */}
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
            
            {/* Payment Routes */}
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-canceled" element={<PaymentCanceled />} />
            
            {/* 404 Route */}
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
