
import { Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { PrivateRoute } from "./PrivateRoute";
import { lazyWithFallback } from "@/utils/lazyWithFallback";
import { PageLoading } from "@/components/ui/page-loading";

// Lazy loading with fallback
const PageLoadingFallback = () => <PageLoading isLoading={true} centered={true} />;

// Authenticated pages
const Dashboard = lazyWithFallback(() => import("../pages/Dashboard"), PageLoadingFallback);
const MedicalDocumentation = lazyWithFallback(() => import("../pages/MedicalDocumentation"), PageLoadingFallback);
const SubscriptionPlans = lazyWithFallback(() => import("../pages/SubscriptionPlans"), PageLoadingFallback);
const UserProfile = lazyWithFallback(() => import("../pages/UserProfile"), PageLoadingFallback);

export function AuthenticatedRoutes() {
  return (
    <>
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/medical-documentation"
        element={
          <PrivateRoute>
            <Layout>
              <MedicalDocumentation />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/subscription-plans"
        element={
          <PrivateRoute>
            <Layout>
              <SubscriptionPlans />
            </Layout>
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Layout>
              <UserProfile />
            </Layout>
          </PrivateRoute>
        }
      />
    </>
  );
}
