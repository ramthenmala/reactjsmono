import { memo } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8', 
  lg: 'w-12 h-12',
} as const;

export const LoadingSpinner = memo(({ 
  size = 'md', 
  className = '', 
  text 
}: LoadingSpinnerProps) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-300 border-t-brand-600`}
        role="status"
        aria-label="Loading"
      />
      {text && (
        <span className="text-sm text-gray-600 animate-pulse">
          {text}
        </span>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';