'use client';

import React from 'react';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  type?: InputType;
  error?: string;
  helperText?: string;
  variant?: 'default' | 'premium';
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  variant = 'default',
  ...props
}) => {
  /* CHAMA Design System — 04-components/forms/spec: Height 40, Radius 8, Border Gray-300, Focus Primary-600, Error Danger-500, Label top */
  const baseClasses =
    variant === 'premium'
      ? 'block w-full h-shamar-40 rounded-lg border border-gray-300 bg-gray-900 text-gray-0 placeholder-gray-500 shadow-shamar-soft focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all text-shamar-body'
      : 'block w-full h-shamar-40 rounded-lg border border-gray-300 bg-gray-0 text-gray-900 placeholder-gray-500 shadow-shamar-soft focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20 transition-all text-shamar-body';
  const errorClasses = error ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20' : '';

  return (
    <div className="mb-shamar-16">
      {label && (
        <label htmlFor={id} className="block text-shamar-small font-medium text-gray-700 mb-shamar-8">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`${baseClasses} px-shamar-12 ${errorClasses} ${className}`}
        {...props}
      />
      {error && <p className="mt-shamar-8 text-shamar-small text-danger-500">{error}</p>}
      {helperText && !error && <p className="mt-shamar-8 text-shamar-small text-gray-500">{helperText}</p>}
    </div>
  );
};

