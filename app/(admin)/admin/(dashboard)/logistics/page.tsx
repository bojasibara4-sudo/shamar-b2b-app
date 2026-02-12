import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getCurrentUser } from '@/lib/auth';
import { Truck, Package, AlertTriangle, BarChart3 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminLogisticsOverviewPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') redirect('/admin/login');

  const supabase = await createClient();
  const [
    { count: activeCount },
    { data: incidents },
    { data: providers },
  ] = await Promise.all([
    (supabase as any).from('deliveries').select('id', { count: 'exact', head: true }).in('status', ['pending', 'shipped']),
    (supabase as any).from('delivery_incidents').select('id, type, status, created_at').eq('status', 'open').limit(10),
    (supabase as any).from('logistics_providers').select('id, name, is_active').eq('is_active', true),
  ]);

  const activeDeliveries = activeCount ?? 0;
  const openIncidents = (incidents || []).length;
  const activeProviders = (providers || []).length;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="flex items-center justify-between">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Logistique</h1>
            <Link href="/admin/overview" className="text-shamar-small text-gray-500 hover:text-primary-600 font-medium">← Admin</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-shamar-16">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <div className="flex items-center gap-2 text-gray-500 text-shamar-small"><Truck size={18} /> Livraisons actives</div>
              <p className="text-shamar-h2 font-bold text-gray-900 mt-1">{activeDeliveries}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <div className="flex items-center gap-2 text-gray-500 text-shamar-small"><AlertTriangle size={18} /> Incidents ouverts</div>
              <p className="text-shamar-h2 font-bold text-gray-900 mt-1">{openIncidents}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <div className="flex items-center gap-2 text-gray-500 text-shamar-small"><BarChart3 size={18} /> Transporteurs actifs</div>
              <p className="text-shamar-h2 font-bold text-gray-900 mt-1">{activeProviders}</p>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="font-semibold text-gray-900 mb-shamar-16 text-shamar-body">Back-office logistique</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-shamar-12">
              <Link href="/admin/logistics/operations" className="flex items-center gap-shamar-12 p-shamar-24 rounded-shamar-md border border-gray-200 hover:border-primary-600/30 hover:bg-gray-50 transition-colors">
                <Package size={24} className="text-primary-600 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Opérations</p>
                  <p className="text-shamar-small text-gray-500">Toutes les expéditions, filtres, mise à jour</p>
                </div>
              </Link>
              <Link href="/admin/logistics/providers" className="flex items-center gap-shamar-12 p-shamar-24 rounded-shamar-md border border-gray-200 hover:border-primary-600/30 hover:bg-gray-50 transition-colors">
                <Truck size={24} className="text-primary-600 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Transporteurs</p>
                  <p className="text-shamar-small text-gray-500">Ajouter, tarifs, SLA, régions</p>
                </div>
              </Link>
              <Link href="/admin/logistics/incidents" className="flex items-center gap-shamar-12 p-shamar-24 rounded-shamar-md border border-gray-200 hover:border-primary-600/30 hover:bg-gray-50 transition-colors">
                <AlertTriangle size={24} className="text-warning-500 shrink-0" />
                <div>
                  <p className="font-semibold text-gray-900">Incidents</p>
                  <p className="text-shamar-small text-gray-500">Tickets, escalade, remboursement, arbitrage</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
