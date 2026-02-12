import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Package, FileText, Ship, DollarSign, Inbox } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ExporterDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Dashboard Exportateur</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Gérez vos offres et exportations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-shamar-24">
            <Link href="/dashboard/exporter/offers" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Package className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Mes offres</p>
            </Link>
            <Link href="/dashboard/exporter/rfqs" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Inbox className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Demandes reçues</p>
            </Link>
            <Link href="/dashboard/exporter/contracts" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <FileText className="h-10 w-10 text-danger-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Contrats</p>
            </Link>
            <Link href="/dashboard/exporter/shipments" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Ship className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Expéditions</p>
            </Link>
            <Link href="/dashboard/seller/payouts" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <DollarSign className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Revenus</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
