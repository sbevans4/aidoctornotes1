
import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./routes/PrivateRoute";
import { AppProvider } from "./providers/AppProvider";
import { ErrorBoundary } from "@/components/ui/error-boundary";

// Lazy loaded pages for better performance
const Index = lazy(() => import("./pages/Index"));
const Enterprise = lazy(() => import("./pages/Enterprise"));
const Auth = lazy(() => import("./pages/Auth"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const PasswordReset = lazy(() => import("./pages/PasswordReset"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const Services = lazy(() => import("./pages/Services"));
const AIDoctorNotes = lazy(() => import("./pages/Services/AIDoctorNotes"));
const AITherapyNotes = lazy(() => import("./pages/Services/AITherapyNotes"));
const AIMedicalTranscription = lazy(() => import("./pages/Services/AIMedicalTranscription"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Security = lazy(() => import("./pages/Security"));
const SecurityDashboard = lazy(() => import("./pages/SecurityDashboard"));
const Contact = lazy(() => import("./pages/Contact"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const MedicalDocumentation = lazy(() => import("./pages/MedicalDocumentation"));
const SubscriptionPlans = lazy(() => import("./pages/SubscriptionPlans"));
const UserProfile = lazy(() => import("./pages/UserProfile"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentCanceled = lazy(() => import("./pages/PaymentCanceled"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="h-screen w-full flex items-center justify-center">
    <div className="animate-pulse text-primary flex flex-col items-center">
      <div className="h-12 w-12 border-4 border-t-primary border-r-transparent border-b-primary border-l-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-lg font-medium">Loading...</p>
    </div>
  </div>
);

// Create a QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
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
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <Index />
                    </Layout>
                  </Suspense>
                }
              />
              <Route 
                path="/auth" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Auth />
                  </Suspense>
                } 
              />
              <Route 
                path="/auth/forgot-password" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <ForgotPassword />
                  </Suspense>
                } 
              />
              <Route 
                path="/auth/reset-password" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PasswordReset />
                  </Suspense>
                } 
              />
              <Route 
                path="/auth/verify" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <EmailVerification />
                  </Suspense>
                } 
              />
              
              <Route
                path="/enterprise"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <Enterprise />
                    </Layout>
                  </Suspense>
                }
              />
              
              {/* Service Routes */}
              <Route
                path="/services"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <Services />
                    </Layout>
                  </Suspense>
                }
              />
              <Route
                path="/services/ai-doctor-notes"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <AIDoctorNotes />
                    </Layout>
                  </Suspense>
                }
              />
              <Route
                path="/services/ai-therapy-notes"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <AITherapyNotes />
                    </Layout>
                  </Suspense>
                }
              />
              <Route
                path="/services/ai-medical-transcription"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <AIMedicalTranscription />
                    </Layout>
                  </Suspense>
                }
              />
              
              {/* Blog Routes */}
              <Route
                path="/blog"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <Blog />
                    </Layout>
                  </Suspense>
                }
              />
              <Route
                path="/blog/:slug"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <BlogPost />
                    </Layout>
                  </Suspense>
                }
              />
              
              {/* Security Routes */}
              <Route
                path="/security"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <Security />
                    </Layout>
                  </Suspense>
                }
              />
              <Route
                path="/security/dashboard"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <Layout>
                        <SecurityDashboard />
                      </Layout>
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/contact"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <Contact />
                    </Layout>
                  </Suspense>
                }
              />
              
              {/* Authenticated Routes */}
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/medical-documentation"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <Layout>
                        <MedicalDocumentation />
                      </Layout>
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/subscription-plans"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <Layout>
                        <SubscriptionPlans />
                      </Layout>
                    </Suspense>
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Suspense fallback={<LoadingFallback />}>
                      <Layout>
                        <UserProfile />
                      </Layout>
                    </Suspense>
                  </PrivateRoute>
                }
              />
              
              {/* Payment Routes */}
              <Route 
                path="/payment-success" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PaymentSuccess />
                  </Suspense>
                } 
              />
              <Route 
                path="/payment-canceled" 
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <PaymentCanceled />
                  </Suspense>
                } 
              />
              
              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <Suspense fallback={<LoadingFallback />}>
                    <Layout>
                      <NotFound />
                    </Layout>
                  </Suspense>
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
