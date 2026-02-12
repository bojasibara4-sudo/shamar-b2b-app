import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getNegoceOffersBySupplier, getNegoceRFQsBySupplier, getNegoceContractsBySupplier } from '@/services/negoce.service';
import { Package, Inbox, FileText, Ship, DollarSign } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NegoceSellerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const offers = await getNegoceOffersBySupplier(user.id);
  const rfqs = await getNegoceRFQsBySupplier(user.id);
  const contracts = await getNegoceContractsBySupplier(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Dashboard Fournisseur Négoce</h1>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-shamar-24">
            <Link href="/dashboard/negoce/seller/offers" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Package className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Mes offres</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{offers.length}</p>
            </Link>
            <Link href="/dashboard/negoce/seller/rfqs" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Inbox className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Demandes reçues</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{rfqs.length}</p>
            </Link>
            <Link href="/dashboard/negoce/seller/contracts" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <FileText className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Contrats</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{contracts.length}</p>
            </Link>
            <Link href="/dashboard/seller/payouts" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <DollarSign className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Revenus</p>
            </Link>
            <Link href="/dashboard/negoce/seller/shipments" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Ship className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Expéditions</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
