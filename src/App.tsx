
import { BrowserRouter as Router, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { AppProvider } from "./providers/AppProvider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AppRoutes } from "./routes/AppRoutes";

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <Router>
          <AppProvider>
            <AppRoutes />
            <Toaster />
          </AppProvider>
        </Router>
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
