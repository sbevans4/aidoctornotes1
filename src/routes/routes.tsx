
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { DefaultLoadingFallback, lazyWithFallback } from "@/utils/lazyWithFallback";

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
const Index = lazyWithFallback(() => import("../pages/Index"), PageLoadingFallback);
const Enterprise = lazyWithFallback(() => import("../pages/Enterprise"), PageLoadingFallback);
const Auth = lazyWithFallback(() => import("../pages/Auth"), PageLoadingFallback);
const ForgotPassword = lazyWithFallback(() => import("../pages/ForgotPassword"), PageLoadingFallback);
const PasswordReset = lazyWithFallback(() => import("../pages/PasswordReset"), PageLoadingFallback);
const EmailVerification = lazyWithFallback(() => import("../pages/EmailVerification"), PageLoadingFallback);
const Contact = lazyWithFallback(() => import("../pages/Contact"), PageLoadingFallback);
const NotFound = lazyWithFallback(() => import("../pages/NotFound"), PageLoadingFallback);

// Import route groups
import { MainRoutes } from './MainRoutes';
import { ServiceRoutes } from './ServiceRoutes';
import { BlogRoutes } from './BlogRoutes';
import { SecurityRoutes } from './SecurityRoutes';
import { AuthenticatedRoutes } from './AuthenticatedRoutes';
import { PaymentRoutes } from './PaymentRoutes';

export const AppRoutes = () => {
  return (
    <>
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
      
      <Route
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      
      {/* Import grouped routes */}
      <ServiceRoutes />
      <BlogRoutes />
      <SecurityRoutes />
      <AuthenticatedRoutes />
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
    </>
  );
};
