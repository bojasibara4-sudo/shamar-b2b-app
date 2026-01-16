import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth';
import GlobalUserMenu from '@/components/GlobalUserMenu';

export const dynamic = 'force-dynamic';

export default async function MarketplaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  // Marketplace accessible à tous (public + auth)
  // Mais layout avec navigation si auth

  return (
    <div className="min-h-screen bg-gray-50">
      {user && (
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-xl font-bold text-emerald-600">
                  SHAMAR Marketplace
                </a>
              </div>
              <div className="flex items-center gap-4">
                <GlobalUserMenu user={user} />
              </div>
            </div>
          </div>
        </nav>
      )}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
