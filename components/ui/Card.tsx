import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'premium';
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, variant = 'default' }) => {
  const baseClasses = variant === 'premium'
    ? 'surface backdrop-blur-sm shadow-shamar-medium border text-primary'
    : 'card border';

  const interactiveClasses = onClick
    ? 'cursor-pointer hover:shadow-shamar-medium transition-all duration-200'
    : '';

  const borderStyle: React.CSSProperties = variant === 'premium'
    ? { borderColor: 'var(--gold, #d4af37)' }
    : { borderColor: 'rgba(0,0,0,0.1)' };

  return (
    <div
      className={`${baseClasses} ${interactiveClasses} ${className}`}
      style={{ borderRadius: 'var(--radius, 14px)', ...borderStyle }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-shamar-16 border-b border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-shamar-16 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => {
  return (
    <div className={`p-shamar-16 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

