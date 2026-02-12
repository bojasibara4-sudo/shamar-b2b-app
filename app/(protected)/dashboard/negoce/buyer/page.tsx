import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getNegoceRFQsByBuyer, getNegoceContractsByBuyer } from '@/services/negoce.service';
import { Package, FileText, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NegoceBuyerDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const rfqs = await getNegoceRFQsByBuyer(user.id);
  const contracts = await getNegoceContractsByBuyer(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Dashboard Acheteur Négoce</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-shamar-24">
            <Link href="/negoce" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Package className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Catalogue</p>
            </Link>
            <Link href="/dashboard/negoce/buyer/rfqs" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <FileText className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Mes RFQ</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{rfqs.length}</p>
            </Link>
            <Link href="/dashboard/negoce/buyer/contracts" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <FileText className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Contrats</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{contracts.length}</p>
            </Link>
            <Link href="/dashboard/negoce/disputes" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <AlertTriangle className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Litiges</p>
            </Link>
          </div>
          <Link href="/negoce" className="inline-flex gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700">Demander un devis</Link>
        </div>
      </div>
    </div>
  );
}
