'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';

import { X as ErrorIcon } from '@/components/ui/lucide-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error boundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className='bg-destructive/10 p-4 rounded-lg'>
            <div className='flex'>
              <div className='shrink-0'>
                <ErrorIcon className='h-5 w-5 text-destructive' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-destructive'>
                  Something went wrong
                </h3>
                <div className='mt-2 text-sm text-destructive/80'>
                  <p>
                    {this.state.error?.message ??
                      'An unexpected error occurred'}
                  </p>
                </div>
                <div className='mt-4'>
                  <button
                    type='button'
                    className='rounded-md bg-destructive/10 px-2 py-1.5 text-sm font-medium text-destructive hover:bg-destructive/20 focus:outline-none focus:ring-2 focus:ring-destructive focus:ring-offset-2 focus:ring-offset-destructive/10'
                    onClick={() =>
                      this.setState({ hasError: false, error: null })
                    }
                  >
                    Try again
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<T extends object>(
  Component: React.ComponentType<T>,
  FallbackComponent?: React.ComponentType<{ error: Error | null }>
) {
  return function WithErrorBoundary(props: T) {
    return (
      <ErrorBoundary
        fallback={
          FallbackComponent ? <FallbackComponent error={null} /> : undefined
        }
      >
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
