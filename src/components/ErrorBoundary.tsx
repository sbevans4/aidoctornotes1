
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw, AlertTriangle } from "lucide-react";
import { MobileResponsiveWrapper } from "@/components/layout/MobileResponsiveWrapper";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
    // Here you could send the error to a logging service
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
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
              <AlertTriangle className="h-5 w-5 mb-2" />
              <AlertTitle className="text-lg font-semibold">Something went wrong</AlertTitle>
              <AlertDescription className="mt-2">
                {this.state.error?.message || "An unexpected error occurred. Please try again."}
              </AlertDescription>
              {this.state.errorInfo && (
                <details className="mt-4">
                  <summary className="text-sm cursor-pointer hover:underline">Technical Details</summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
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
