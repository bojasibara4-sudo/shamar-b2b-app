import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { FileText, Package, AlertTriangle, Shield, Truck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminChinaDashboardPage() {
  const supabase = await createClient();

  const [
    rfqRes,
    { data: orders },
    { data: incidents },
  ] = await Promise.all([
    (supabase as any).from('product_rfqs').select('*', { count: 'exact', head: true }),
    (supabase as any).from('orders').select('id, status').limit(1000),
    (supabase as any).from('delivery_incidents').select('id, status').eq('status', 'open'),
  ]);

  const rfqCount = (rfqRes as { count?: number })?.count ?? 0;
  const ordersList = Array.isArray(orders) ? orders : [];
  const delayed = 0;
  const openIncidents = Array.isArray(incidents) ? incidents.length : 0;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div className="flex items-center justify-between">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Admin Sourcing Chine</h1>
            <Link href="/admin/overview" className="text-shamar-small text-gray-500 hover:text-primary-600 font-medium">← Admin</Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <FileText className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">RFQ totales</p>
              <p className="text-shamar-h2 text-gray-900 font-bold mt-1">{rfqCount}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Package className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Commandes</p>
              <p className="text-shamar-h2 text-gray-900 font-bold mt-1">{ordersList.length}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Truck className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Retards</p>
              <p className="text-shamar-h2 text-gray-900 font-bold mt-1">{delayed}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <AlertTriangle className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Incidents ouverts</p>
              <p className="text-shamar-h2 text-gray-900 font-bold mt-1">{openIncidents}</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Shield className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Escrows</p>
              <p className="text-shamar-h2 text-gray-900 font-bold mt-1">—</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-shamar-24">
            <Link href="/admin/china/suppliers" className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-600/30 transition-colors">
              <p className="font-semibold text-gray-900">Fournisseurs</p>
              <p className="text-shamar-small text-gray-500 mt-1">Validation, KYC</p>
            </Link>
            <Link href="/admin/china/orders" className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-600/30 transition-colors">
              <p className="font-semibold text-gray-900">Commandes</p>
              <p className="text-shamar-small text-gray-500 mt-1">Supervision</p>
            </Link>
            <Link href="/admin/china/escrows" className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-600/30 transition-colors">
              <p className="font-semibold text-gray-900">Escrows</p>
              <p className="text-shamar-small text-gray-500 mt-1">Gestion paiements</p>
            </Link>
            <Link href="/admin/china/incidents" className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-600/30 transition-colors">
              <p className="font-semibold text-gray-900">Incidents</p>
              <p className="text-shamar-small text-gray-500 mt-1">Litiges</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
