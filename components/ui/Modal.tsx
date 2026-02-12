'use client';

import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'premium';
}

const getSizeClasses = (size: 'sm' | 'md' | 'lg' | 'xl'): string => {
  switch (size) {
    case 'sm':
      return 'max-w-md';
    case 'md':
      return 'max-w-lg';
    case 'lg':
      return 'max-w-2xl';
    case 'xl':
      return 'max-w-4xl';
    default:
      return 'max-w-lg';
  }
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  variant = 'default',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || typeof window === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay — premium fintech */}
      <div
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal panel — spec: Modals = Large (shamar-lg), shadow large */}
      <div
        ref={modalRef}
        className={`relative rounded-shamar-lg shadow-shamar-large transform transition-all sm:w-full ${getSizeClasses(size)} ${variant === 'premium'
            ? 'bg-brand-bleu-ardoise/90 backdrop-blur-md border border-brand-anthracite/50 text-white'
            : 'bg-gray-0 text-gray-900 border border-gray-200'
          }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-shamar-16 border-b ${variant === 'premium' ? 'border-brand-anthracite/50' : 'border-gray-200'}`}>
          <h3 className={`text-shamar-h3 ${variant === 'premium' ? 'text-white' : 'text-gray-900'}`} id="modal-title">
            {title}
          </h3>
          <button
            type="button"
            className={`${variant === 'premium' ? 'text-gray-400 hover:text-white hover:bg-brand-anthracite/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'} p-2 rounded-shamar-sm focus:outline-none focus:ring-2 focus:ring-primary-600/20 transition-colors`}
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <span className="text-2xl">×</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-shamar-16">{children}</div>

        {/* Footer */}
        {footer && (
          <div className={`flex justify-end p-shamar-16 border-t gap-shamar-12 ${variant === 'premium' ? 'border-brand-anthracite/50' : 'border-gray-200'}`}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

