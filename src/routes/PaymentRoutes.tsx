
import React from 'react';
import { Route } from 'react-router-dom';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCanceled from '@/pages/PaymentCanceled';

export const PaymentRoutes = () => {
  return (
    <>
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-canceled" element={<PaymentCanceled />} />
    </>
  );
};
