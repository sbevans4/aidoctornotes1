
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import MedicalDocumentation from '@/pages/MedicalDocumentation';
import SubscriptionPlans from '@/pages/SubscriptionPlans';
import UserProfile from '@/pages/UserProfile';
import { PrivateRoute } from './PrivateRoute';

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
