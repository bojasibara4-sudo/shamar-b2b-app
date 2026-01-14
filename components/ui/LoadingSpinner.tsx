import React from 'react';

export type LoadingSpinnerSize = 'sm' | 'md' | 'lg';

interface LoadingSpinnerProps {
  size?: LoadingSpinnerSize;
  className?: string;
}

const getSizeClasses = (size: LoadingSpinnerSize): string => {
  switch (size) {
    case 'sm':
      return 'h-4 w-4 border-2';
    case 'md':
      return 'h-6 w-6 border-3';
    case 'lg':
      return 'h-8 w-8 border-4';
    default:
      return 'h-6 w-6 border-3';
  }
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
}) => {
  const sizeClasses = getSizeClasses(size);
  return (
    <div
      className={`${sizeClasses} border-current border-t-transparent text-black rounded-full animate-spin ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

