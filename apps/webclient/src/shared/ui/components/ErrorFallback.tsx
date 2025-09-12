import { memo } from 'react';
import { Button } from '@compass/shared-ui';
import { AlertTriangle, RefreshCw01 } from '@untitledui/icons';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  message?: string;
  showDetails?: boolean;
  className?: string;
}

export const ErrorFallback = memo(
  ({
    error,
    resetErrorBoundary,
    message = 'Something went wrong',
    showDetails = false,
    className = '',
  }: ErrorFallbackProps) => {
    return (
      <div
        className={`flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg ${className}`}
        role='alert'
        data-qa-id="error-fallback"
      >
        <AlertTriangle className='w-12 h-12 text-red-500 mb-4' data-qa-id="error-fallback-icon" />

        <h2 className='text-lg font-semibold text-red-900 mb-2 text-center' data-qa-id="error-fallback-title">
          {message}
        </h2>

        {showDetails && (
          <details className='mb-4 w-full' data-qa-id="error-fallback-details">
            <summary className='cursor-pointer text-sm text-red-700 hover:text-red-800' data-qa-id="error-fallback-details-summary">
              Show error details
            </summary>
            <pre className='mt-2 p-3 bg-red-100 rounded text-xs text-red-800 overflow-auto max-h-32' data-qa-id="error-fallback-details-content">
              {error.message}
            </pre>
          </details>
        )}

        <Button
          color='secondary'
          size='md'
          onClick={resetErrorBoundary}
          iconLeading={RefreshCw01}
          className='bg-white hover:bg-red-50 border-red-300 text-red-700'
          data-qa-id="error-fallback-retry-button"
        >
          Try again
        </Button>
      </div>
    );
  },
);

ErrorFallback.displayName = 'ErrorFallback';
