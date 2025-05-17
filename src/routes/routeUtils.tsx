
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { PrivateRoute } from './PrivateRoute';

// Helper function to create a route with Layout
export const createLayoutRoute = (path: string, Component: React.ComponentType) => (
  <Route
    key={path}
    path={path}
    element={
      <Layout>
        <Component />
      </Layout>
    }
  />
);

// Helper function to create a private route with Layout
export const createPrivateRoute = (path: string, Component: React.ComponentType) => (
  <Route
    key={path}
    path={path}
    element={
      <PrivateRoute>
        <Layout>
          <Component />
        </Layout>
      </PrivateRoute>
    }
  />
);
