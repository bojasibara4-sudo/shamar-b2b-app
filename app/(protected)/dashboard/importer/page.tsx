import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { Package, MapPin, FileText, DollarSign, AlertTriangle, Globe } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ImporterDashboardPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const commandsCount = 0;
  const contractsCount = 0;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Dashboard Importateur</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Gérez vos commandes et importations internationales</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-shamar-24">
            <Link href="/international" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Globe className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Catalogue</p>
              <p className="text-gray-900 font-semibold mt-1">Rechercher fournisseurs</p>
            </Link>
            <Link href="/dashboard/importer/orders" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <Package className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Commandes actives</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{commandsCount}</p>
            </Link>
            <Link href="/dashboard/importer/tracking" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <MapPin className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Tracking</p>
            </Link>
            <Link href="/dashboard/importer/contracts" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <FileText className="h-10 w-10 text-danger-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Contrats</p>
              <p className="text-shamar-h2 text-gray-900 mt-1">{contractsCount}</p>
            </Link>
            <Link href="/payments" className="block bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all">
              <DollarSign className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="text-shamar-small text-gray-500">Paiements</p>
            </Link>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Actions rapides</h2>
            <div className="flex flex-wrap gap-shamar-16">
              <Link href="/international" className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700">
                Demander un devis
              </Link>
              <Link href="/dashboard/international/disputes" className="inline-flex items-center gap-2 px-shamar-24 py-3 border border-gray-200 text-gray-700 font-medium rounded-shamar-md hover:bg-gray-50">
                <AlertTriangle size={18} /> Litiges
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
