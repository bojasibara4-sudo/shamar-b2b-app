import { requireAdmin } from '@/lib/auth-guard';
import Link from 'next/link';
import { Shield, UserCheck, AlertTriangle, DollarSign, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminInternationalPage() {
  await requireAdmin();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
              Admin <span className="text-primary-600">Commerce International</span>
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Validation fournisseurs, KYC, antifraude, commissions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <UserCheck className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Validation fournisseurs</p>
              <p className="text-shamar-small text-gray-500 font-medium">KYC & vérification</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <Shield className="h-10 w-10 text-primary-600 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Surveillance fraude</p>
              <p className="text-shamar-small text-gray-500 font-medium">Scoring & alertes</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <AlertTriangle className="h-10 w-10 text-warning-500 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Blocage comptes</p>
              <p className="text-shamar-small text-gray-500 font-medium">Suspension</p>
            </div>
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <DollarSign className="h-10 w-10 text-success-500 mb-shamar-16" />
              <p className="font-semibold text-gray-900 text-shamar-body">Commissions</p>
              <p className="text-shamar-small text-gray-500 font-medium">Gestion %</p>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Actions</h2>
            <div className="flex flex-wrap gap-shamar-16">
              <Link
                href="/dashboard/admin/disputes"
                className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-warning-500 text-gray-0 font-semibold rounded-shamar-md hover:bg-amber-600 transition-colors text-shamar-body"
              >
                <FileText size={20} /> Litiges
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
