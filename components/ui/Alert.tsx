'use client';

import React from 'react';

export type AlertVariant = 'success' | 'info' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  message: string;
  onClose?: () => void;
  className?: string;
}

const getVariantClasses = (variant: AlertVariant): { bg: string; text: string } => {
  switch (variant) {
    case 'success':
      return { bg: 'bg-green-100', text: 'text-green-800' };
    case 'info':
      return { bg: 'bg-blue-100', text: 'text-blue-800' };
    case 'warning':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
    case 'error':
      return { bg: 'bg-red-100', text: 'text-red-800' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' };
  }
};

const getIcon = (variant: AlertVariant): string => {
  switch (variant) {
    case 'success':
      return '✓';
    case 'info':
      return 'ℹ';
    case 'warning':
      return '⚠';
    case 'error':
      return '✕';
    default:
      return 'ℹ';
  }
};

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  message,
  onClose,
  className = '',
}) => {
  const { bg, text } = getVariantClasses(variant);
  const icon = getIcon(variant);

  return (
    <div
      className={`${bg} ${text} p-3 rounded-md flex items-center justify-between shadow-sm ${className}`}
      role="alert"
    >
      <div className="flex items-center">
        <span className={`text-lg mr-2 ${text}`} aria-hidden="true">
          {icon}
        </span>
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`flex-shrink-0 p-1.5 rounded-md inline-flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 ${text} hover:opacity-70`}
          aria-label="Close"
        >
          <span className="sr-only">Close</span>
          <span className="text-lg">×</span>
        </button>
      )}
    </div>
  );
};

