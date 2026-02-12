import { requireAdmin } from '@/lib/auth-guard';

export const dynamic = 'force-dynamic';

/**
 * Toutes les routes /admin/* sauf /admin/login passent par ce layout.
 * Protection rôle admin : redirection vers /dashboard si non-admin.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <>
      <nav className="bg-gray-0 shadow-shamar-soft border-b border-gray-200">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <a href="/admin/overview" className="text-xl font-bold text-primary-600">
              SHAMAR Admin
            </a>
            <a href="/admin/overview" className="text-shamar-small text-gray-500 hover:text-gray-900">
              Tableau de bord
            </a>
          </div>
        </div>
      </nav>
      <main className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-32">
        {children}
      </main>
    </>
  );
}
