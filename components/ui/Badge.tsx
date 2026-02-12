import React from 'react';

export type BadgeVariant = 'default' | 'premium' | 'success' | 'warning' | 'danger';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', className = '' }) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'premium':
        return 'badge-premium';
      case 'success':
        return 'text-primary';
      case 'warning':
        return 'text-primary';
      case 'danger':
        return 'text-primary';
      default:
        return 'surface text-primary';
    }
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'success':
        return { backgroundColor: 'var(--success-500, #22C55E)', color: 'white' };
      case 'warning':
        return { backgroundColor: 'var(--warning-500, #F59E0B)', color: 'white' };
      case 'danger':
        return { backgroundColor: 'var(--danger-500, #EF4444)', color: 'white' };
      default:
        return {};
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded text-shamar-small font-medium ${getVariantClasses()} ${className}`}
      style={{ borderRadius: 'var(--radius, 14px)', ...getVariantStyles() }}
    >
      {children}
    </span>
  );
};
