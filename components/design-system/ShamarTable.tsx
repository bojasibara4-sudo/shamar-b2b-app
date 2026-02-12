'use client';

import React from 'react';

/**
 * SHAMAR Design System — 03-dashboard-ui/tables/spec
 * Row height 48, Header bold, Hover highlight, Sticky header, Pagination bottom right, Bulk actions top
 */
export function ShamarTable({
  headers,
  rows,
  bulkActions,
  pagination,
  className = '',
}: {
  headers: { key: string; label: string }[];
  rows: Record<string, React.ReactNode>[];
  bulkActions?: React.ReactNode;
  pagination?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-gray-0 rounded-shamar-md shadow-shamar-soft border border-gray-200 overflow-hidden ${className}`}>
      {bulkActions && (
        <div className="p-shamar-16 border-b border-gray-200 bg-gray-50">
          {bulkActions}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-shamar-body text-left">
          <thead className="bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
            <tr>
              {headers.map((h) => (
                <th
                  key={h.key}
                  className="h-shamar-48 px-shamar-16 font-semibold text-gray-900 whitespace-nowrap"
                >
                  {h.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row, i) => (
              <tr
                key={i}
                className="h-shamar-48 hover:bg-gray-100 transition-colors"
              >
                {headers.map((h) => (
                  <td key={h.key} className="px-shamar-16 text-gray-700 whitespace-nowrap">
                    {row[h.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="p-shamar-16 border-t border-gray-200 flex justify-end">
          {pagination}
        </div>
      )}
    </div>
  );
}
