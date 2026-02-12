'use client';

import { usePathname } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import Link from 'next/link';

const PUBLIC_HOST_PATHS = ['/host', '/host/'];

function isPublicHostPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === '/host') return true;
  // /host/[uuid] - seul segment après /host (pas "payments", "booking")
  const parts = pathname.split('/').filter(Boolean);
  if (parts[0] !== 'host') return false;
  if (parts.length === 1) return true;
  // /host/[id] où id est un UUID ou nombre (pas "payments", "booking")
  const second = parts[1];
  return second !== 'payments' && second !== 'booking';
}

export default function HostLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = isPublicHostPath(pathname);

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-brand-gris-clair">
        <nav className="bg-white shadow-sm border-b border-brand-gris-clair">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-6">
                <Link href="/host" className="text-xl font-bold text-brand-vert hover:text-brand-vert-fonce transition-colors">
                  SHAMAR Host
                </Link>
                <div className="flex items-center gap-4">
                  <Link href="/host" className="text-sm font-medium text-slate-600 hover:text-brand-vert transition-colors">
                    Catalogue
                  </Link>
                  <Link href="/dashboard/host" className="text-sm font-medium text-slate-600 hover:text-brand-vert transition-colors">
                    Mon tableau de bord
                  </Link>
                  <Link href="/dashboard/host/properties" className="text-sm font-medium text-slate-600 hover:text-brand-vert transition-colors">
                    Mes propriétés
                  </Link>
                  <Link href="/dashboard/host/bookings" className="text-sm font-medium text-slate-600 hover:text-brand-vert transition-colors">
                    Réservations
                  </Link>
                  <Link href="/dashboard/host/finance" className="text-sm font-medium text-slate-600 hover:text-brand-vert transition-colors">
                    Revenus
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
