
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PrivateRoute } from "./PrivateRoute";
import { Layout } from "@/components/layout/Layout";
import { PageLoading } from "@/components/ui/page-loading";
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PaymentRoutes } from "./PaymentRoutes";
import { ServiceRoutes } from "./ServiceRoutes";
import { ReferralRoutes } from "./ReferralRoutes";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Auth pages
const Auth = lazyWithFallback(() => import("../pages/Auth"), PageLoadingFallback);
const ForgotPassword = lazyWithFallback(() => import("../pages/ForgotPassword"), PageLoadingFallback);
const PasswordReset = lazyWithFallback(() => import("../pages/PasswordReset"), PageLoadingFallback);
const EmailVerification = lazyWithFallback(() => import("../pages/EmailVerification"), PageLoadingFallback);

// Main pages
const Index = lazyWithFallback(() => import("../pages/Index"), PageLoadingFallback);
const MedicalDocumentation = lazyWithFallback(() => import("../pages/MedicalDocumentation"), PageLoadingFallback);
const UserProfile = lazyWithFallback(() => import("../pages/UserProfile"), PageLoadingFallback);
const SubscriptionPlans = lazyWithFallback(() => import("../pages/SubscriptionPlans"), PageLoadingFallback);
const DocumentHistory = lazyWithFallback(() => import("../pages/DocumentHistory"), PageLoadingFallback);
const AccountSettings = lazyWithFallback(() => import("../pages/AccountSettings"), PageLoadingFallback);
const Enterprise = lazyWithFallback(() => import("../pages/Enterprise"), PageLoadingFallback);
const Contact = lazyWithFallback(() => import("../pages/Contact"), PageLoadingFallback);
const NotFound = lazyWithFallback(() => import("../pages/NotFound"), PageLoadingFallback);
const Dashboard = lazyWithFallback(() => import("../pages/Dashboard"), PageLoadingFallback);

// Blog pages
const Blog = lazyWithFallback(() => import("../pages/Blog"), PageLoadingFallback);
const BlogPost = lazyWithFallback(() => import("../pages/BlogPost"), PageLoadingFallback);

export function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <PageLoading isLoading={true} centered={true} />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Layout><Index /></Layout>} />
      <Route path="/enterprise" element={<Layout><Enterprise /></Layout>} />
      <Route path="/contact" element={<Layout><Contact /></Layout>} />
      
      {/* Blog Routes */}
      <Route path="/blog" element={<Layout><Blog /></Layout>} />
      <Route path="/blog/:slug" element={<Layout><BlogPost /></Layout>} />
      
      {/* Auth Routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/reset-password" element={<PasswordReset />} />
      <Route path="/auth/verify" element={<EmailVerification />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <PrivateRoute>
          <Layout><Dashboard /></Layout>
        </PrivateRoute>
      } />
      
      <Route path="/medical-documentation" element={
        <PrivateRoute>
          <Layout><MedicalDocumentation /></Layout>
        </PrivateRoute>
      } />

      <Route path="/subscription-plans" element={
        <PrivateRoute>
          <Layout><SubscriptionPlans /></Layout>
        </PrivateRoute>
      } />

      <Route path="/profile" element={
        <PrivateRoute>
          <Layout><UserProfile /></Layout>
        </PrivateRoute>
      } />

      <Route path="/document-history" element={
        <PrivateRoute>
          <Layout><DocumentHistory /></Layout>
        </PrivateRoute>
      } />

      <Route path="/settings" element={
        <PrivateRoute>
          <Layout><AccountSettings /></Layout>
        </PrivateRoute>
      } />
      
      {/* Payment Routes */}
      {PaymentRoutes()}
      
      {/* Service Routes */}
      {ServiceRoutes()}

      {/* Referral Routes */}
      {ReferralRoutes()}
      
      {/* Fallback route */}
      <Route path="*" element={<Layout><NotFound /></Layout>} />
    </Routes>
  );
}
