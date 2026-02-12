import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';
import { Home, Shield, DollarSign, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminHostPage() {
  await requireAdmin();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
              Administration <span className="text-primary-600">Airbnb / Host</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Modération annonces, vérification hôtes, commissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-shamar-24">
            <Link
              href="/dashboard/admin/host/properties"
              className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-200 hover:bg-gray-50 transition-colors"
            >
              <Home className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-gray-500 text-shamar-small font-medium">Modération annonces</p>
              <p className="text-shamar-h3 font-semibold text-gray-900 mt-1">—</p>
            </Link>
            <div className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Shield className="h-10 w-10 text-amber-500 mb-shamar-16" />
              <p className="text-gray-500 text-shamar-small font-medium">Blocage Host</p>
              <p className="text-shamar-h3 font-semibold text-gray-900 mt-1">—</p>
            </div>
            <div className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <DollarSign className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-gray-500 text-shamar-small font-medium">Commissions</p>
              <p className="text-shamar-h3 font-semibold text-gray-900 mt-1">—</p>
            </div>
            <div className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <AlertTriangle className="h-10 w-10 text-danger-500 mb-shamar-16" />
              <p className="text-gray-500 text-shamar-small font-medium">Antifraude / Logs</p>
              <p className="text-shamar-h3 font-semibold text-gray-900 mt-1">—</p>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Outils admin Host</h2>
            <p className="text-shamar-body text-gray-600 font-medium">
              Modération des annonces, vérification identité des hôtes, gestion des conflits et commissions.
              Interface à compléter selon les besoins métier.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
