
import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("Error caught by error boundary:", error, info);
    // Here you could send the error to a logging service
  }

  handleRetry = (): void => {
    if (this.props.onReset) {
      this.props.onReset();
    }
    this.setState({ hasError: false, error: null });
  };

  navigateHome = (): void => {
    window.location.href = "/";
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div 
          className="flex justify-center items-center min-h-[50vh] p-4" 
          role="alert" 
          aria-live="assertive"
        >
          <Card className="max-w-md w-full shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-red-100 p-3">
                  <AlertCircle className="h-6 w-6 text-red-600" aria-hidden="true" />
                </div>
              </div>
              <CardTitle className="text-center">Something went wrong</CardTitle>
              <CardDescription className="text-center">
                We're sorry, but there was an error loading this page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {this.state.error && (
                  <div 
                    className="bg-gray-100 p-3 rounded-md overflow-auto max-h-32 text-sm"
                    aria-label="Error details"
                  >
                    <p className="text-gray-700 font-mono">{this.state.error.toString()}</p>
                  </div>
                )}
                <div className="flex gap-3 flex-col sm:flex-row">
                  <Button 
                    className="flex-1 flex items-center justify-center" 
                    onClick={this.handleRetry}
                    aria-label="Try again"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 flex items-center justify-center"
                    onClick={this.navigateHome}
                    aria-label="Go to homepage"
                  >
                    <Home className="mr-2 h-4 w-4" aria-hidden="true" />
                    Go to Homepage
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// A Higher Order Component to wrap components with an ErrorBoundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>, 
  fallback?: ReactNode,
  onReset?: () => void
): React.FC<P> {
  return (props: P) => (
    <ErrorBoundary fallback={fallback} onReset={onReset}>
      <Component {...props} />
    </ErrorBoundary>
  );
}
