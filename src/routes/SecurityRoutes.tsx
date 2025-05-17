
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Security from '@/pages/Security';
import SecurityDashboard from '@/pages/SecurityDashboard';
import Contact from '@/pages/Contact';
import { PrivateRoute } from './PrivateRoute';

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
};
