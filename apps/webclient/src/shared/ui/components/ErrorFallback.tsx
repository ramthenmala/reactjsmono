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

export const ErrorFallback = memo(({
  error,
  resetErrorBoundary,
  message = 'Something went wrong',
  showDetails = false,
  className = '',
}: ErrorFallbackProps) => {
  return (
    <div 
      className={`flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-lg ${className}`}
      role="alert"
    >
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      
      <h2 className="text-lg font-semibold text-red-900 mb-2 text-center">
        {message}
      </h2>
      
      {showDetails && (
        <details className="mb-4 w-full">
          <summary className="cursor-pointer text-sm text-red-700 hover:text-red-800">
            Show error details
          </summary>
          <pre className="mt-2 p-3 bg-red-100 rounded text-xs text-red-800 overflow-auto max-h-32">
            {error.message}
          </pre>
        </details>
      )}
      
      <Button
        color="secondary"
        size="md"
        onClick={resetErrorBoundary}
        iconLeading={RefreshCw01}
        className="bg-white hover:bg-red-50 border-red-300 text-red-700"
      >
        Try again
      </Button>
    </div>
  );
});

ErrorFallback.displayName = 'ErrorFallback';