'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:text-gray-900">
            Accueil
          </Link>
        </li>
        {segments.map((segment, index) => {
          const href = '/' + segments.slice(0, index + 1).join('/');
          const label = segment
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          const isLast = index === segments.length - 1;

          return (
            <li key={href} className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              {isLast ? (
                <span className="text-gray-900 font-medium">{label}</span>
              ) : (
                <Link href={href} className="hover:text-gray-900">
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

