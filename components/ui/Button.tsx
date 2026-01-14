'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

const getVariantClasses = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
      return 'bg-black hover:bg-gray-800 text-white focus:ring-black';
    case 'secondary':
      return 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400';
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500';
    case 'outline':
      return 'border border-gray-300 hover:bg-gray-100 text-gray-700 focus:ring-gray-200';
    case 'ghost':
      return 'hover:bg-gray-100 text-gray-700 focus:ring-gray-200';
    default:
      return 'bg-black hover:bg-gray-800 text-white focus:ring-black';
  }
};

const getSizeClasses = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'md':
      return 'px-4 py-2 text-base';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return 'px-4 py-2 text-base';
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'relative inline-flex items-center justify-center font-medium rounded-md shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = getVariantClasses(variant);
  const sizeClasses = getSizeClasses(size);
  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="absolute left-3 h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      <span className={isLoading ? 'invisible' : 'visible'}>
        {children}
      </span>
    </button>
  );
};

