
import { Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./PrivateRoute";
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from "@/components/ui/page-loading";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Referral pages
const ReferralDashboard = lazyWithFallback(() => import('../pages/ReferralDashboard'), PageLoadingFallback);
const ReferralAdmin = lazyWithFallback(() => import('../pages/admin/ReferralAdmin'), PageLoadingFallback);

export function ReferralRoutes() {
  return (
    <>
      <Route
        path="/referrals"
        element={
          <PrivateRoute>
            <Layout>
              <ReferralDashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/referrals"
        element={
          <PrivateRoute>
            <Layout>
              <ReferralAdmin />
            </Layout>
          </PrivateRoute>
        }
      />
    </>
  );
}
