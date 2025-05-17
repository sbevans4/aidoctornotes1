
import React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import Services from '@/pages/Services';
import AIDoctorNotes from '@/pages/Services/AIDoctorNotes';
import AITherapyNotes from '@/pages/Services/AITherapyNotes';
import AIMedicalTranscription from '@/pages/Services/AIMedicalTranscription';

export const ServiceRoutes = () => {
  return (
    <>
      <Route
        path="/services"
        element={
          <Layout>
            <Services />
          </Layout>
        }
      />
      <Route
        path="/services/ai-doctor-notes"
        element={
          <Layout>
            <AIDoctorNotes />
          </Layout>
        }
      />
      <Route
        path="/services/ai-therapy-notes"
        element={
          <Layout>
            <AITherapyNotes />
          </Layout>
        }
      />
      <Route
        path="/services/ai-medical-transcription"
        element={
          <Layout>
            <AIMedicalTranscription />
          </Layout>
        }
      />
    </>
  );
};
