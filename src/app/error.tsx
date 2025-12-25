'use client';

import { useEffect } from 'react';

import { X as ErrorIcon } from '@/components/ui/lucide-icons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center p-4'>
      <div className='bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full'>
        <div className='text-center'>
          <ErrorIcon className='mx-auto h-12 w-12 text-destructive' />
          <h2 className='mt-4 text-2xl font-bold text-gray-900'>
            Oops! Something went wrong
          </h2>
          <p className='mt-2 text-gray-600'>
            {error.message || 'An unexpected error occurred. Please try again.'}
          </p>
          <div className='mt-6'>
            <button
              onClick={() => reset()}
              className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            >
              Try again
            </button>
          </div>
          <div className='mt-6 border-t border-gray-200 pt-4'>
            <p className='text-sm text-gray-500'>
              If the problem persists, please contact support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
