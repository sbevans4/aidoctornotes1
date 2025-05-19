
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { MobileResponsiveWrapper } from "@/components/layout/MobileResponsiveWrapper";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    // Here you could send the error to a logging service
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      return (
        <MobileResponsiveWrapper className="py-12">
          <div className="max-w-md mx-auto">
            <Alert variant="destructive" className="mb-6">
              <AlertTitle className="text-lg font-semibold">Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                {this.state.error?.message || "An unexpected error occurred. Please try again."}
              </AlertDescription>
            </Alert>
            <div className="text-center">
              <Button 
                onClick={this.handleRetry} 
                variant="outline"
                className="flex items-center gap-2"
                aria-label="Retry"
              >
                <RefreshCcw className="h-4 w-4" /> 
                Try Again
              </Button>
            </div>
          </div>
        </MobileResponsiveWrapper>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
