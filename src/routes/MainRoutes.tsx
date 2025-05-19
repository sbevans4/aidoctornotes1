
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from "@/components/ui/page-loading";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

const Index = lazyWithFallback(() => import('@/pages/Index'), PageLoadingFallback);
const Enterprise = lazyWithFallback(() => import('@/pages/Enterprise'), PageLoadingFallback);
const Auth = lazyWithFallback(() => import('@/pages/Auth'), PageLoadingFallback);
const Contact = lazyWithFallback(() => import('@/pages/Contact'), PageLoadingFallback);
const Dashboard = lazyWithFallback(() => import('@/pages/Dashboard'), PageLoadingFallback);
const MedicalDocumentation = lazyWithFallback(() => import('@/pages/MedicalDocumentation'), PageLoadingFallback);
const UserProfile = lazyWithFallback(() => import('@/pages/UserProfile'), PageLoadingFallback);
const SubscriptionPlans = lazyWithFallback(() => import('@/pages/SubscriptionPlans'), PageLoadingFallback);

export const MainRoutes = () => {
  return (
    <>
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
        path="/contact"
        element={
          <Layout>
            <Contact />
          </Layout>
        }
      />
      <Route
        path="/enterprise"
        element={
          <Layout>
            <Enterprise />
          </Layout>
        }
      />
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
        path="/subscription-plans"
        element={
          <Layout>
            <SubscriptionPlans />
          </Layout>
        }
      />
    </>
  );
};
