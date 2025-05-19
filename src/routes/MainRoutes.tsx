
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Index from '@/pages/Index';
import Enterprise from '@/pages/Enterprise';
import Auth from '@/pages/Auth';
import Contact from '@/pages/Contact';
import { PrivateRoute } from './PrivateRoute';
import MedicalDocumentation from '@/pages/MedicalDocumentation';
import Dashboard from '@/pages/Dashboard';
import UserProfile from '@/pages/UserProfile';
import SubscriptionPlans from '@/pages/SubscriptionPlans';

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
