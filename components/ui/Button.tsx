'use client';

import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'premium' | 'premium-outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  children: React.ReactNode;
}

/* CHAMA Design System — 04-components/buttons/spec: Height 40, Padding 16, Radius medium */
const getVariantClasses = (variant: ButtonVariant): string => {
  switch (variant) {
    case 'primary':
      return 'btn-primary text-white shadow-shamar-soft hover:shadow-shamar-medium';
    case 'secondary':
      return 'surface text-primary hover:opacity-90';
    case 'danger':
      return 'text-white shadow-shamar-soft hover:shadow-shamar-medium';
    case 'outline':
      return 'border surface text-primary hover:opacity-90';
    case 'ghost':
      return 'text-primary hover:opacity-80';
    case 'premium':
      return 'badge-premium font-semibold hover:shadow-shamar-medium border';
    case 'premium-outline':
      return 'border badge-premium text-primary hover:opacity-90 font-semibold';
    default:
      return 'btn-primary text-white shadow-shamar-soft hover:shadow-shamar-medium';
  }
};

const getVariantStyles = (variant: ButtonVariant): React.CSSProperties => {
  switch (variant) {
    case 'danger':
      return { backgroundColor: 'var(--danger-500, #EF4444)' };
    case 'premium':
    case 'premium-outline':
      return { borderColor: 'var(--gold)' };
    default:
      return {};
  }
};

const getSizeClasses = (size: ButtonSize): string => {
  switch (size) {
    case 'sm':
      return 'h-9 px-shamar-12 text-shamar-small';
    case 'md':
      return 'h-shamar-40 px-shamar-16 text-shamar-body';
    case 'lg':
      return 'h-12 px-shamar-24 text-shamar-body-lg';
    default:
      return 'h-shamar-40 px-shamar-16 text-shamar-body';
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
    'relative inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = getVariantClasses(variant);
  const variantStyles = getVariantStyles(variant);
  const sizeClasses = getSizeClasses(size);
  const disabledClasses = disabled || isLoading ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`}
      style={{ ...variantStyles, borderRadius: 'var(--radius, 14px)' }}
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

