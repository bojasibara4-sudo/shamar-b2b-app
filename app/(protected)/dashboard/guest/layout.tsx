import { requireAuth } from '@/lib/auth-guard';

export default async function GuestDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="/dashboard/guest" className="text-xl font-bold text-gray-900">
              SHAMAR Guest
            </a>
            <div className="flex gap-4">
              <a href="/host" className="text-sm font-medium text-slate-400 hover:text-white">
                Rechercher un logement
              </a>
              <a href="/dashboard/disputes" className="text-sm font-medium text-slate-400 hover:text-white">
                Litiges
              </a>
              <a href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white">
                Tableau de bord principal
              </a>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
