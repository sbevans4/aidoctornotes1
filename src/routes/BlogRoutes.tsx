
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from "@/components/ui/page-loading";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Lazy load blog-related pages
const Blog = lazyWithFallback(() => import('@/pages/Blog'), PageLoadingFallback);
const BlogPost = lazyWithFallback(() => import('@/pages/BlogPost'), PageLoadingFallback);

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
        path="/blog/:id"
        element={
          <Layout>
            <BlogPost />
          </Layout>
        }
      />
    </>
  );
};
