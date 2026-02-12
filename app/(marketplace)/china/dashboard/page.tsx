import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { FileText, Package, Ship, Shield, AlertTriangle, ArrowRight, Plus, MapPin, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  const [
    { data: rfqList },
    { data: orderList },
  ] = await Promise.all([
    (supabase as any).from('product_rfqs').select('id').eq('buyer_id', user.id).in('status', ['sent', 'pending']),
    (supabase as any).from('orders').select('id, status').eq('buyer_id', user.id),
  ]);

  const rfqCount = Array.isArray(rfqList) ? rfqList.length : 0;
  const orders = Array.isArray(orderList) ? orderList : [];
  const inProduction = orders.filter((o: any) => ['paid', 'processing', 'confirmed'].includes(o?.status)).length;
  const shipped = orders.filter((o: any) => o?.status === 'shipped').length;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Dashboard Sourcing Chine</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Vos RFQ, commandes, livraisons et escrows.</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <FileText className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">RFQ actives</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{rfqCount}</p>
              <Link href="/china/rfqs" className="text-shamar-small text-primary-600 font-medium hover:underline mt-2 inline-block">Voir</Link>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Package className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">En production</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{inProduction}</p>
              <Link href="/china/orders" className="text-shamar-small text-primary-600 font-medium hover:underline mt-2 inline-block">Voir</Link>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Ship className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">En mer / transit</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{shipped}</p>
              <Link href="/china/shipments" className="text-shamar-small text-primary-600 font-medium hover:underline mt-2 inline-block">Voir</Link>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Shield className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Escrows bloqués</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">—</p>
              <Link href="/china/wallet" className="text-shamar-small text-primary-600 font-medium hover:underline mt-2 inline-block">Portefeuille</Link>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <AlertTriangle className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Alertes incidents</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">0</p>
              <Link href="/china/incidents/create" className="text-shamar-small text-primary-600 font-medium hover:underline mt-2 inline-block">Signaler</Link>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="text-shamar-h3 text-gray-900 mb-shamar-24">Actions rapides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-shamar-16">
              <Link href="/china/rfq/create" className="flex items-center gap-shamar-16 p-shamar-24 rounded-shamar-md border border-gray-200 hover:border-primary-600/30 hover:bg-gray-50 transition-colors">
                <Plus className="h-10 w-10 text-primary-600 shrink-0" />
                <span className="font-semibold text-gray-900">Nouvelle demande devis</span>
              </Link>
              <Link href="/china/orders" className="flex items-center gap-shamar-16 p-shamar-24 rounded-shamar-md border border-gray-200 hover:border-primary-600/30 hover:bg-gray-50 transition-colors">
                <Package className="h-10 w-10 text-primary-600 shrink-0" />
                <span className="font-semibold text-gray-900">Mes commandes</span>
              </Link>
              <Link href="/china/shipments" className="flex items-center gap-shamar-16 p-shamar-24 rounded-shamar-md border border-gray-200 hover:border-primary-600/30 hover:bg-gray-50 transition-colors">
                <MapPin className="h-10 w-10 text-primary-600 shrink-0" />
                <span className="font-semibold text-gray-900">Expéditions</span>
              </Link>
              <Link href="/china/wallet" className="flex items-center gap-shamar-16 p-shamar-24 rounded-shamar-md border border-gray-200 hover:border-primary-600/30 hover:bg-gray-50 transition-colors">
                <DollarSign className="h-10 w-10 text-primary-600 shrink-0" />
                <span className="font-semibold text-gray-900">Portefeuille</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
