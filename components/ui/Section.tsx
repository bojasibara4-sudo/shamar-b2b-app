import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const Section: React.FC<SectionProps> = ({ children, title, subtitle, className = '' }) => {
  return (
    <section className={`py-shamar-32 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-shamar-24">
          {title && (
            <h2 className="text-shamar-h2 text-primary font-semibold mb-2">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-shamar-body text-muted">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
};
