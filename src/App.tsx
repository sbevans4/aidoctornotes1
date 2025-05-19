import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { AppProvider } from "./providers/AppProvider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { DefaultLoadingFallback, lazyWithFallback } from "./utils/lazyWithFallback";

// Enhanced loading fallback with size customization
const PageLoadingFallback = () => (
  <div className="min-h-screen w-full flex items-center justify-center p-4">
    <div className="animate-pulse text-primary flex flex-col items-center max-w-md mx-auto">
      <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin mb-4" 
           role="status" 
           aria-label="Loading page">
      </div>
      <p className="text-lg font-medium" aria-live="polite">Loading...</p>
    </div>
  </div>
);

// Lazy load pages with custom loading states
const Index = lazyWithFallback(() => import("./pages/Index"), PageLoadingFallback);
const Enterprise = lazyWithFallback(() => import("./pages/Enterprise"), PageLoadingFallback);
const Auth = lazyWithFallback(() => import("./pages/Auth"), PageLoadingFallback);
const ForgotPassword = lazyWithFallback(() => import("./pages/ForgotPassword"), PageLoadingFallback);
const PasswordReset = lazyWithFallback(() => import("./pages/PasswordReset"), PageLoadingFallback);
const EmailVerification = lazyWithFallback(() => import("./pages/EmailVerification"), PageLoadingFallback);

// Service pages - load them in a separate chunk
const Services = lazyWithFallback(() => import("./pages/Services"), PageLoadingFallback);
const AIDoctorNotes = lazyWithFallback(() => import("./pages/Services/AIDoctorNotes"), PageLoadingFallback);
const AITherapyNotes = lazyWithFallback(() => import("./pages/Services/AITherapyNotes"), PageLoadingFallback);
const AIMedicalTranscription = lazyWithFallback(() => import("./pages/Services/AIMedicalTranscription"), PageLoadingFallback);

// Blog pages - load them in a separate chunk
const Blog = lazyWithFallback(() => import("./pages/Blog"), PageLoadingFallback);
const BlogPost = lazyWithFallback(() => import("./pages/BlogPost"), PageLoadingFallback);

// Security pages - load them in a separate chunk
const Security = lazyWithFallback(() => import("./pages/Security"), PageLoadingFallback);
const SecurityDashboard = lazyWithFallback(() => import("./pages/SecurityDashboard"), PageLoadingFallback);
const Contact = lazyWithFallback(() => import("./pages/Contact"), PageLoadingFallback);

// Dashboard and user pages - load them in a separate chunk
const Dashboard = lazyWithFallback(() => import("./pages/Dashboard"), PageLoadingFallback);
const MedicalDocumentation = lazyWithFallback(() => import("./pages/MedicalDocumentation"), PageLoadingFallback);
const SubscriptionPlans = lazyWithFallback(() => import("./pages/SubscriptionPlans"), PageLoadingFallback);
const UserProfile = lazyWithFallback(() => import("./pages/UserProfile"), PageLoadingFallback);

// Payment pages - load them in a separate chunk
const PaymentSuccess = lazyWithFallback(() => import("./pages/PaymentSuccess"), PageLoadingFallback);
const PaymentCanceled = lazyWithFallback(() => import("./pages/PaymentCanceled"), PageLoadingFallback);
const NotFound = lazyWithFallback(() => import("./pages/NotFound"), PageLoadingFallback);

// Create a QueryClient instance with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      useErrorBoundary: true, // Use error boundaries for query errors
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <AppProvider>
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
          </AppProvider>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
