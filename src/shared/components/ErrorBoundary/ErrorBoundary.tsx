import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * ErrorBoundary catches JavaScript errors anywhere in the component tree,
 * displays a fallback UI, and logs error information.
 *
 * Place this component at a high level in your app to catch errors from
 * child components and prevent the entire app from crashing.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  /**
   * Update state when an error is thrown.
   * This is called during the "render" phase, so side-effects are not allowed.
   */
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  /**
   * Called when an error is thrown by a descendant component.
   * This is called during the "commit" phase, so side-effects are allowed.
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Error Info:', errorInfo);
    }

    // Update state with errorInfo for display
    this.setState({
      errorInfo,
    });

    // TODO: Send error to logging service (e.g., Sentry, LogRocket)
    // logErrorToService(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      const { error, errorInfo } = this.state;

      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-primary to-purple-500">
          <div className="max-w-lg w-full p-10 bg-bg-primary rounded-lg shadow-xl text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold text-text-primary my-0 mb-4">Something went wrong</h1>
            <p className="text-text-secondary leading-relaxed my-0 mb-6">
              We apologize for the inconvenience. An unexpected error has occurred.
            </p>

            {process.env.NODE_ENV === 'development' && error && (
              <details className="my-6 text-left">
                <summary className="cursor-pointer p-2.5 bg-bg-tertiary rounded-sm font-medium text-primary select-none transition-all duration-fast hover:bg-border">
                  View error details (development only)
                </summary>
                <div className="mt-4 p-4 bg-text-primary rounded-sm text-bg-secondary font-mono text-sm overflow-x-auto">
                  <h4 className="my-0 mb-2 text-error text-xs uppercase tracking-wider">
                    Error:
                  </h4>
                  <pre className="my-0 whitespace-pre-wrap break-words text-[#a6e22e]">
                    {error.toString()}
                  </pre>
                  {errorInfo && (
                    <>
                      <h4 className="my-0 mb-2 text-error text-xs uppercase tracking-wider">
                        Component Stack:
                      </h4>
                      <pre className="my-0 whitespace-pre-wrap break-words text-[#a6e22e]">
                        {errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-4 justify-center mt-6 flex-wrap">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 text-base font-medium bg-primary text-white border-none rounded-md cursor-pointer transition-all duration-fast hover:bg-primary-hover hover:-translate-y-px hover:shadow-md active:translate-y-0"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="px-6 py-3 text-base font-medium bg-bg-tertiary text-text-primary border-none rounded-md cursor-pointer transition-all duration-fast hover:bg-border active:translate-y-0"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
