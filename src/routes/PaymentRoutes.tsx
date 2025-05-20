
import { Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from "@/components/ui/page-loading";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Payment pages
const PaymentSuccess = lazyWithFallback(() => import("../pages/PaymentSuccess"), PageLoadingFallback);
const PaymentCanceled = lazyWithFallback(() => import("../pages/PaymentCanceled"), PageLoadingFallback);

export function PaymentRoutes() {
  return (
    <>
      <Route
        path="/payment-success"
        element={
          <Layout>
            <PaymentSuccess />
          </Layout>
        }
      />
      <Route
        path="/payment-canceled"
        element={
          <Layout>
            <PaymentCanceled />
          </Layout>
        }
      />
    </>
  );
}
