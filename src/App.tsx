
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AppProvider } from "./providers/AppProvider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageLoading } from "@/components/ui/page-loading";
import { useAuth } from "@/contexts/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { lazyWithFallback } from "@/utils/lazyWithFallback";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Lazy load all pages
const Index = lazyWithFallback(() => import("./pages/Index"), PageLoadingFallback);
const Enterprise = lazyWithFallback(() => import("./pages/Enterprise"), PageLoadingFallback);
const Services = lazyWithFallback(() => import("./pages/Services"), PageLoadingFallback);
const Auth = lazyWithFallback(() => import("./pages/Auth"), PageLoadingFallback);
const ForgotPassword = lazyWithFallback(() => import("./pages/ForgotPassword"), PageLoadingFallback);
const PasswordReset = lazyWithFallback(() => import("./pages/PasswordReset"), PageLoadingFallback);
const EmailVerification = lazyWithFallback(() => import("./pages/EmailVerification"), PageLoadingFallback);
const Contact = lazyWithFallback(() => import("./pages/Contact"), PageLoadingFallback);
const NotFound = lazyWithFallback(() => import("./pages/NotFound"), PageLoadingFallback);
const Dashboard = lazyWithFallback(() => import("./pages/Dashboard"), PageLoadingFallback);
const MedicalDocumentation = lazyWithFallback(() => import("./pages/MedicalDocumentation"), PageLoadingFallback);
const SubscriptionPlans = lazyWithFallback(() => import("./pages/SubscriptionPlans"), PageLoadingFallback);
const UserProfile = lazyWithFallback(() => import("./pages/UserProfile"), PageLoadingFallback);
const PaymentSuccess = lazyWithFallback(() => import("./pages/PaymentSuccess"), PageLoadingFallback);
const PaymentCanceled = lazyWithFallback(() => import("./pages/PaymentCanceled"), PageLoadingFallback);

// Service Pages
const DoctorNotes = lazyWithFallback(() => import('./pages/Services/AIDoctorNotes'), PageLoadingFallback);
const TherapyNotes = lazyWithFallback(() => import('./pages/Services/AITherapyNotes'), PageLoadingFallback);
const Transcription = lazyWithFallback(() => import('./pages/Services/AIMedicalTranscription'), PageLoadingFallback);
const ImageAnalysis = lazyWithFallback(() => import('@/components/ImageAnalyzer'), PageLoadingFallback);

// New Referral Pages
const ReferralDashboard = lazyWithFallback(() => import('./pages/ReferralDashboard'), PageLoadingFallback);
const ReferralAdmin = lazyWithFallback(() => import('./pages/admin/ReferralAdmin'), PageLoadingFallback);

// Create a QueryClient instance with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      throwOnError: true, // Use error boundaries for query errors
    },
  },
});

function AppContent() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoading isLoading={true} fullPage={true} />;
  }

  return (
    <Routes>
      {/* Index Routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Index />
          </Layout>
        }
      />
      <Route
        path="/services"
        element={
          <Layout>
            <Services />
          </Layout>
        }
      />

      {/* Auth Routes */}
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
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />

      {/* Service Routes */}
      <Route
        path="/services/doctor-notes"
        element={
          <Layout>
            <DoctorNotes />
          </Layout>
        }
      />
      <Route
        path="/services/therapy-notes"
        element={
          <Layout>
            <TherapyNotes />
          </Layout>
        }
      />
      <Route
        path="/services/transcription"
        element={
          <Layout>
            <Transcription />
          </Layout>
        }
      />
      <Route
        path="/services/image-analysis"
        element={
          <PrivateRoute requiredFeature="image_analysis">
            <Layout>
              <ImageAnalysis />
            </Layout>
          </PrivateRoute>
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

      {/* New Referral Routes */}
      <Route
        path="/referrals"
        element={
          <PrivateRoute>
            <Layout>
              <ReferralDashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/referrals"
        element={
          <PrivateRoute>
            <Layout>
              <ReferralAdmin />
            </Layout>
          </PrivateRoute>
        }
      />

      {/* Payment Routes */}
      <Route
        path="/payment-success"
        element={
          <Layout>
            <PaymentSuccess />
          </Layout>
        }
      />
      <Route
        path="/payment-canceled"
        element={
          <Layout>
            <PaymentCanceled />
          </Layout>
        }
      />

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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <AppProvider>
            <AppContent />
            <Toaster />
          </AppProvider>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
