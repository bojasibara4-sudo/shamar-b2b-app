'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import GlobalUserMenu from '@/components/GlobalUserMenu';
import TopTabs from './TopTabs';
import HomeBottomNav from '@/components/home/HomeBottomNav';
import { Search, Camera, Bell, MessageCircle } from 'lucide-react';

export default function MetierShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { profile } = useAuth();
  const user = profile ? { id: profile.id, email: profile.email, role: profile.role } : null;

  const isAuthRoute = pathname?.startsWith('/auth');
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAuthRoute) {
    return <>{children}</>;
  }

  // Dashboard : pas de header/tabs/bottom nav (layout dashboard avec sidebar)
  if (isDashboardRoute) {
    return <>{children}</>;
  }

  // Admin : layout propre (login, validation) sans header marketplace
  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header principal */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 h-14">
            <Link href="/" className="flex-shrink-0 font-bold text-lg text-gray-900">
              SHAMAR
            </Link>
            <div className="flex-1 flex items-center bg-gray-100 rounded-xl px-3 py-2 min-w-0">
              <Search size={18} className="flex-shrink-0 text-gray-500" />
              <input
                placeholder="Rechercher sur tout l'écosystème SHAMAR..."
                className="bg-transparent outline-none ml-2 w-full text-sm"
              />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                title="Recherche par image"
              >
                <Camera size={20} className="text-gray-600" />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                title="Notifications"
              >
                <Bell size={20} className="text-gray-600" />
              </button>
              <Link
                href="/messages"
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative"
                title="Messages"
              >
                <MessageCircle size={20} className="text-gray-600" />
              </Link>
              {user ? (
                <GlobalUserMenu user={user} />
              ) : (
                <Link
                  href="/auth/login"
                  className="px-3 py-1.5 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
        {/* Tabs horizontaux - masqués sur dashboard (sidebar à la place) */}
        {!isDashboardRoute && <TopTabs />}
      </header>

      {/* Contenu principal */}
      <main className="flex-1 pb-20 md:pb-4">{children}</main>

      {/* Bottom nav - persistante sur parcours métier */}
      {!isDashboardRoute && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:static md:z-auto">
          <HomeBottomNav />
        </div>
      )}
    </div>
  );
}
