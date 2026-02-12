import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';
import { Shield, UserCheck, AlertTriangle, DollarSign, FileText, Ban } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminNegocePage() {
  await requireAdmin();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
              Admin <span className="text-primary-600">Négoce Matières Premières</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Validation fournisseurs, audit, scoring risque, blacklist, commissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <UserCheck className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Validation fournisseurs</p>
              <p className="text-shamar-small text-gray-500 font-medium">KYC & documents légaux</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Shield className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Audit entreprises</p>
              <p className="text-shamar-small text-gray-500 font-medium">Scoring risque</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Ban className="h-10 w-10 text-danger-500 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Blacklist</p>
              <p className="text-shamar-small text-gray-500 font-medium">Exclusion</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <DollarSign className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Commissions</p>
              <p className="text-shamar-small text-gray-500 font-medium">Gestion %</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <FileText className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Logs</p>
              <p className="text-shamar-small text-gray-500 font-medium">Traçabilité</p>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Actions</h2>
            <div className="flex flex-wrap gap-shamar-16">
              <Link
                href="/dashboard/admin/disputes"
                className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-warning-500 text-gray-0 font-semibold rounded-shamar-md hover:bg-amber-600 transition-colors text-shamar-body"
              >
                <AlertTriangle size={20} /> Litiges
              </Link>
              <Link
                href="/negoce"
                className="inline-flex items-center gap-2 px-shamar-24 py-3 border border-gray-200 font-semibold text-gray-700 rounded-shamar-md hover:bg-gray-50 transition-colors text-shamar-body"
              >
                Catalogue négoce
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
