
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Index from '@/pages/Index';
import Enterprise from '@/pages/Enterprise';
import Auth from '@/pages/Auth';

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
        path="/enterprise"
        element={
          <Layout>
            <Enterprise />
          </Layout>
        }
      />
    </>
  );
};
