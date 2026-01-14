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
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
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
        <tbody>
          {data.map((item, rowIndex) => (
            <tr key={item.id || rowIndex} className="bg-white border-b hover:bg-gray-50">
              {columns.map((column, colIndex) => (
                <td
                  key={typeof column.key === 'string' ? `${item.id}-${column.key}` : `cell-${rowIndex}-${colIndex}`}
                  className={`py-4 px-6 ${column.className || ''}`}
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
        <div className="p-4 bg-white border-t flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
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
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
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

  return (
    <div className="flex items-center space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
      >
        ‹
      </button>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={idx} className="px-3 py-1 text-sm text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`px-3 py-1 border rounded text-sm ${
              page === currentPage
                ? 'bg-black text-white border-black'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
      >
        ›
      </button>
    </div>
  );
}

