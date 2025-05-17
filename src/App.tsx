
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/toaster";
import { MainRoutes } from "./routes/MainRoutes";
import { ServiceRoutes } from "./routes/ServiceRoutes";
import { BlogRoutes } from "./routes/BlogRoutes";
import { SecurityRoutes } from "./routes/SecurityRoutes";
import { AuthenticatedRoutes } from "./routes/AuthenticatedRoutes";
import { PaymentRoutes } from "./routes/PaymentRoutes";
import NotFound from "./pages/NotFound";
import { Route } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import Auth from "./pages/Auth";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <Routes>
            {/* Main Routes */}
            <MainRoutes />
            
            {/* Service Routes */}
            <ServiceRoutes />
            
            {/* Blog Routes */}
            <BlogRoutes />
            
            {/* Security Routes */}
            <SecurityRoutes />
            
            {/* Authenticated Routes */}
            <AuthenticatedRoutes />
            
            {/* Payment Routes */}
            <PaymentRoutes />
            
            {/* 404 Route */}
            <Route
              path="*"
              element={
                <Layout>
                  <NotFound />
                </Layout>
              }
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
