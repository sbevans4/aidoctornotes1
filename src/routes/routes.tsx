
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from '@/components/ui/page-loading';

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

// This file is kept for reference but is no longer actively used.
// All routes are now defined in AppRoutes.tsx
// This file will be deprecated in future updates.

// Lazy load pages with custom loading states
const Index = lazyWithFallback(() => import("../pages/Index"), PageLoadingFallback);
const Enterprise = lazyWithFallback(() => import("../pages/Enterprise"), PageLoadingFallback);
const Services = lazyWithFallback(() => import("../pages/Services"), PageLoadingFallback);
const Auth = lazyWithFallback(() => import("../pages/Auth"), PageLoadingFallback);
const ForgotPassword = lazyWithFallback(() => import("../pages/ForgotPassword"), PageLoadingFallback);
const PasswordReset = lazyWithFallback(() => import("../pages/PasswordReset"), PageLoadingFallback);
const EmailVerification = lazyWithFallback(() => import("../pages/EmailVerification"), PageLoadingFallback);
const Contact = lazyWithFallback(() => import("../pages/Contact"), PageLoadingFallback);
const NotFound = lazyWithFallback(() => import("../pages/NotFound"), PageLoadingFallback);
const Dashboard = lazyWithFallback(() => import("../pages/Dashboard"), PageLoadingFallback);
const MedicalDocumentation = lazyWithFallback(() => import("../pages/MedicalDocumentation"), PageLoadingFallback);
const SubscriptionPlans = lazyWithFallback(() => import("../pages/SubscriptionPlans"), PageLoadingFallback);
const UserProfile = lazyWithFallback(() => import("../pages/UserProfile"), PageLoadingFallback);
const PaymentSuccess = lazyWithFallback(() => import("../pages/PaymentSuccess"), PageLoadingFallback);
const PaymentCanceled = lazyWithFallback(() => import("../pages/PaymentCanceled"), PageLoadingFallback);

// Deprecated Route definitions - for reference only
// These export functions are no longer used directly in the app
// All routes are now defined in AppRoutes.tsx

export const IndexRoutes = () => (
  <>
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
  </>
);

export const AuthRoutes = () => (
  <>
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
  </>
);

// Service routes will be imported from ServiceRoutes.tsx
export { ServiceRoutes } from './ServiceRoutes';

// Blog routes will be imported from BlogRoutes.tsx
export { BlogRoutes } from './BlogRoutes';

// Security routes will be imported from SecurityRoutes.tsx
export { SecurityRoutes } from './SecurityRoutes';

// Authenticated routes
export const AuthenticatedRoutes = () => (
  <>
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
  </>
);

// Payment routes
export const PaymentRoutes = () => (
  <>
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
  </>
);

// 404 Route
export const NotFoundRoute = () => (
  <Route
    path="*"
    element={
      <Layout>
        <NotFound />
      </Layout>
    }
  />
);
