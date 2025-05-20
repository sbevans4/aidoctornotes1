
import { Routes, Route } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/ui/page-loading";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./PrivateRoute";
import { lazyWithFallback } from "@/utils/lazyWithFallback";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Lazy load all pages
const Index = lazyWithFallback(() => import("../pages/Index"), PageLoadingFallback);
const Enterprise = lazyWithFallback(() => import("../pages/Enterprise"), PageLoadingFallback);
const Services = lazyWithFallback(() => import("../pages/Services"), PageLoadingFallback);
const Auth = lazyWithFallback(() => import("../pages/Auth"), PageLoadingFallback);
const ForgotPassword = lazyWithFallback(() => import("../pages/ForgotPassword"), PageLoadingFallback);
const PasswordReset = lazyWithFallback(() => import("../pages/PasswordReset"), PageLoadingFallback);
const EmailVerification = lazyWithFallback(() => import("../pages/EmailVerification"), PageLoadingFallback);
const Contact = lazyWithFallback(() => import("../pages/Contact"), PageLoadingFallback);
const NotFound = lazyWithFallback(() => import("../pages/NotFound"), PageLoadingFallback);

// Import route groups
import { AuthenticatedRoutes } from "./AuthenticatedRoutes"; 
import { ServiceRoutes } from "./ServiceRoutes";
import { PaymentRoutes } from "./PaymentRoutes";
import { ReferralRoutes } from "./ReferralRoutes";

export function AppRoutes() {
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
      <ServiceRoutes />

      {/* Authenticated Routes */}
      <AuthenticatedRoutes />

      {/* Referral Routes */}
      <ReferralRoutes />

      {/* Payment Routes */}
      <PaymentRoutes />

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
