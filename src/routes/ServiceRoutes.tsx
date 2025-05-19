
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from "@/components/ui/page-loading";
import { PrivateRoute } from './PrivateRoute';

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Lazy load service-related pages
const DoctorNotes = lazyWithFallback(() => import('@/pages/Services/AIDoctorNotes'), PageLoadingFallback);
const TherapyNotes = lazyWithFallback(() => import('@/pages/Services/AITherapyNotes'), PageLoadingFallback);
const Transcription = lazyWithFallback(() => import('@/pages/Services/AIMedicalTranscription'), PageLoadingFallback);
const ImageAnalysis = lazyWithFallback(() => import('@/components/ImageAnalyzer'), PageLoadingFallback);

export const ServiceRoutes = () => {
  return (
    <>
      <Route
        path="/services/doctor-notes"
        element={
          <Layout>
            <DoctorNotes />
          </Layout>
        }
      />
      <Route
        path="/services/therapy-notes"
        element={
          <Layout>
            <TherapyNotes />
          </Layout>
        }
      />
      <Route
        path="/services/transcription"
        element={
          <Layout>
            <Transcription />
          </Layout>
        }
      />
      <Route
        path="/services/image-analysis"
        element={
          <PrivateRoute requiredFeature="image_analysis">
            <Layout>
              <ImageAnalysis />
            </Layout>
          </PrivateRoute>
        }
      />
    </>
  );
};
