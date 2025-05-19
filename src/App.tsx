
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AppProvider } from "./providers/AppProvider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { PageLoading } from "@/components/ui/page-loading";
import { useAuth } from "@/contexts/AuthContext";
import { 
  IndexRoutes,
  AuthRoutes,
  ServiceRoutes,
  BlogRoutes,
  SecurityRoutes,
  AuthenticatedRoutes,
  PaymentRoutes,
  NotFoundRoute
} from "./routes/routes";

// Create a QueryClient instance with improved error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      throwOnError: true, // Use error boundaries for query errors
    },
  },
});

function AppContent() {
  const { isLoading } = useAuth();
  
  if (isLoading) {
    return <PageLoading isLoading={true} fullPage={true} />;
  }

  return (
    <Routes>
      <IndexRoutes />
      <AuthRoutes />
      <ServiceRoutes />
      <BlogRoutes />
      <SecurityRoutes />
      <AuthenticatedRoutes />
      <PaymentRoutes />
      <NotFoundRoute />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <AppProvider>
            <AppContent />
            <Toaster />
          </AppProvider>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
