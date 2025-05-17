
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';

export const BlogRoutes = () => {
  return (
    <>
      <Route
        path="/blog"
        element={
          <Layout>
            <Blog />
          </Layout>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <Layout>
            <BlogPost />
          </Layout>
        }
      />
    </>
  );
};
