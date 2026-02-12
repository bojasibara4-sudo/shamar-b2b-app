import { requireAdmin } from '@/lib/auth-guard';
import { getAdminAnalytics } from '@/services/analytics.service';
import { BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage() {
  await requireAdmin();

  const analytics = await getAdminAnalytics();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex items-center gap-shamar-16 mb-2">
            <div className="p-3 bg-primary-100 rounded-shamar-md">
              <BarChart3 className="text-primary-600" size={32} />
            </div>
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                <span className="text-primary-600">Analytics</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium mt-1">
                Statistiques et rapports de la plateforme
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
          <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-24">Indicateurs</h2>
          {analytics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-shamar-16">
              <div className="bg-gray-50 rounded-shamar-md border border-gray-200 p-shamar-24">
                <p className="text-gray-500 text-shamar-small">GMV</p>
                <p className="text-shamar-h2 font-semibold text-gray-900 mt-1">{analytics.gmv?.toLocaleString() || 0} FCFA</p>
              </div>
              <div className="bg-gray-50 rounded-shamar-md border border-gray-200 p-shamar-24">
                <p className="text-gray-500 text-shamar-small">Commandes</p>
                <p className="text-shamar-h2 font-semibold text-gray-900 mt-1">{analytics.totalOrders || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-shamar-md border border-gray-200 p-shamar-24">
                <p className="text-gray-500 text-shamar-small">Revenus plateforme</p>
                <p className="text-shamar-h2 font-semibold text-gray-900 mt-1">{analytics.platformRevenue?.toLocaleString() || 0} FCFA</p>
              </div>
              <div className="bg-gray-50 rounded-shamar-md border border-gray-200 p-shamar-24">
                <p className="text-gray-500 text-shamar-small">Paiements</p>
                <p className="text-shamar-h2 font-semibold text-gray-900 mt-1">{analytics.totalPayments || 0}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-shamar-48 text-gray-500 text-shamar-body">Aucune donnée disponible.</div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
