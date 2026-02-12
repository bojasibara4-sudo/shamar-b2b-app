'use client';

import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Alert } from './Alert';

export interface Column<T> {
  key: keyof T | 'actions' | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  isLoading?: boolean;
  error?: string;
  emptyMessage?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  variant?: 'default' | 'premium';
}

export const Table = <T extends { id?: string | number }>({
  data,
  columns,
  isLoading = false,
  error,
  emptyMessage = 'Aucune donnée disponible.',
  currentPage,
  totalPages,
  onPageChange,
  variant = 'default',
}: TableProps<T>) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6 bg-white rounded-lg shadow">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="error" message={error} className="mt-4" />
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center p-6 bg-white rounded-lg shadow">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`overflow-x-auto relative shadow-md sm:rounded-lg ${variant === 'premium' ? 'border border-brand-anthracite/50 bg-brand-bleu-nuit/30 backdrop-blur-sm' : ''}`}>
      <table className={`w-full text-sm text-left ${variant === 'premium' ? 'text-gray-300' : 'text-gray-500'}`}>
        <thead className={`text-xs uppercase ${variant === 'premium' ? 'bg-brand-bleu-nuit text-brand-or font-black' : 'bg-gray-50 text-gray-700'}`}>
          <tr>
            {columns.map((column, index) => (
              <th
                key={typeof column.key === 'string' ? column.key : `col-${index}`}
                scope="col"
                className={`py-3 px-6 ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={variant === 'premium' ? 'divide-y divide-brand-anthracite/30' : ''}>
          {data.map((item, rowIndex) => (
            <tr
              key={item.id || rowIndex}
              className={`border-b transition-colors ${variant === 'premium'
                ? 'bg-transparent border-brand-anthracite/30 hover:bg-brand-bleu-nuit/60 group'
                : 'bg-white hover:bg-gray-50'
                }`}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={typeof column.key === 'string' ? `${item.id}-${column.key}` : `cell-${rowIndex}-${colIndex}`}
                  className={`py-4 px-6 ${column.className || ''} ${variant === 'premium' && column.key !== 'actions' ? 'group-hover:text-white' : ''}`}
                >
                  {column.render
                    ? column.render(item)
                    : column.key !== 'actions' && typeof column.key === 'string'
                      ? String(item[column.key as keyof T] ?? '')
                      : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {currentPage && totalPages && onPageChange && totalPages > 1 && (
        <div className={`p-4 border-t flex justify-center ${variant === 'premium' ? 'bg-brand-bleu-nuit/50 border-brand-anthracite/30' : 'bg-white'}`}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
            variant={variant}
          />
        </div>
      )}
    </div>
  );
};

// Simple Pagination component
function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  variant = 'default',
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  variant?: 'default' | 'premium';
}) {
  const pages: (number | '...')[] = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const buttonBase = variant === 'premium'
    ? 'border rounded-lg text-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-or/50'
    : 'border rounded text-sm';

  const activeClass = variant === 'premium'
    ? 'bg-brand-or text-brand-noir border-brand-or font-bold shadow-lg shadow-brand-or/20'
    : 'bg-black text-white border-black';

  const inactiveClass = variant === 'premium'
    ? 'border-brand-anthracite text-gray-400 hover:text-white hover:border-brand-or hover:bg-brand-bleu-nuit'
    : 'border-gray-300 hover:bg-gray-50';

  const disabledClass = 'opacity-50 cursor-not-allowed';

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1.5 ${buttonBase} ${inactiveClass} ${currentPage === 1 ? disabledClass : ''}`}
      >
        ‹
      </button>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={idx} className={`px-3 py-1 text-sm ${variant === 'premium' ? 'text-gray-500' : 'text-gray-500'}`}>...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1.5 ${buttonBase} ${page === currentPage ? activeClass : inactiveClass
              }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1.5 ${buttonBase} ${inactiveClass} ${currentPage === totalPages ? disabledClass : ''}`}
      >
        ›
      </button>
    </div>
  );
}

