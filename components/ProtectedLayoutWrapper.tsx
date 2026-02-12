'use client';

import { usePathname } from 'next/navigation';

export default function ProtectedLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname === '/dashboard' || pathname?.startsWith('/dashboard/');

  if (isDashboard) {
    return <div className="min-h-full bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-full bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </div>
  );
}
