'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError:  boolean;
  error:     Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 p-8 text-center" role="alert" aria-live="polite">
          <div className="w-16 h-16 rounded-2xl bg-red-950 flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-400" aria-hidden="true" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-text-primary">Something went wrong</h2>
            <p className="text-text-muted text-sm max-w-md">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <pre className="mt-4 text-xs text-red-400 bg-red-950/50 p-4 rounded-xl text-left overflow-auto max-w-lg">
                {this.state.error.message}
              </pre>
            )}
          </div>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="btn-ghost gap-2"
          >
            <RefreshCw className="w-4 h-4" aria-hidden="true" />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
