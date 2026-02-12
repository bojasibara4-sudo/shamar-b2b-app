import { requireBuyer } from '@/lib/auth-guard';
import { AuthGuard } from '@/components/AuthGuard';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BuyerOffersPage() {
  const user = await requireBuyer();

  const supabase = await createClient();
  const { data: offers } = await (supabase as any)
    .from('offers')
    .select('*, product:products(name, price)')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <AuthGuard requiredRole="buyer">
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex items-center gap-shamar-16 mb-2">
              <div className="p-3 bg-primary-100 rounded-shamar-md">
                <FileText className="text-primary-600" size={32} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  Mes <span className="text-primary-600">offres</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Offres et négociations en cours
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Mes offres</h2>
            {(!offers || offers.length === 0) ? (
              <div className="text-center py-shamar-48">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                  <FileText className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-shamar-body">Aucune offre pour le moment.</p>
                <p className="text-gray-500 text-shamar-small mt-2">Répondez aux demandes de devis (RFQ) pour débuter.</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-gray-200">
                {(offers || []).map((o: any) => (
                  <Link
                    key={o.id}
                    href={`/negociation/${o.id}`}
                    className="block py-shamar-16 px-shamar-16 rounded-shamar-md border border-transparent hover:border-gray-200 hover:bg-gray-50 transition-colors first:pt-0"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900 text-shamar-body">{o.product?.name || `Offre #${o.id?.slice(0, 8)}`}</span>
                      <span className={`px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold ${
                        o.status === 'accepted' ? 'bg-success-500/20 text-emerald-700' :
                        o.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-warning-500/20 text-amber-700'
                      }`}>
                        {o.status === 'pending' ? 'En attente' : o.status === 'accepted' ? 'Accepté' : o.status === 'rejected' ? 'Rejeté' : o.status}
                      </span>
                    </div>
                    <p className="text-shamar-small text-gray-500 mt-1">
                      {(o.price || 0).toLocaleString()} {o.currency || 'FCFA'} x {o.quantity || 1}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </AuthGuard>
  );
}
