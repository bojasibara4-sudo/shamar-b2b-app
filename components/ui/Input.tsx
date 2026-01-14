'use client';

import React from 'react';

export type InputType = 'text' | 'email' | 'password' | 'number' | 'date' | 'tel' | 'url';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id: string;
  type?: InputType;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  id,
  type = 'text',
  error,
  helperText,
  className = '',
  ...props
}) => {
  const baseClasses =
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm';
  const errorClasses = error ? 'border-red-500 focus:ring-red-500' : '';

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`${baseClasses} ${errorClasses} ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {helperText && !error && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  );
};

