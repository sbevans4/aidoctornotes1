
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from "@/components/ui/page-loading";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Lazy load security-related pages
const Security = lazyWithFallback(() => import('@/pages/Security'), PageLoadingFallback);
const SecurityDashboard = lazyWithFallback(() => import('@/pages/SecurityDashboard'), PageLoadingFallback);

export const SecurityRoutes = () => {
  return (
    <>
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
    </>
  );
};
