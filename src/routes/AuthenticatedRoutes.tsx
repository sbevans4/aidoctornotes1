
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from "@/components/ui/page-loading";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

const Dashboard = lazyWithFallback(() => import('@/pages/Dashboard'), PageLoadingFallback);
const MedicalDocumentation = lazyWithFallback(() => import('@/pages/MedicalDocumentation'), PageLoadingFallback);
const UserProfile = lazyWithFallback(() => import('@/pages/UserProfile'), PageLoadingFallback);
const SubscriptionPlans = lazyWithFallback(() => import('@/pages/SubscriptionPlans'), PageLoadingFallback);

export const AuthenticatedRoutes = () => {
  return (
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
};
