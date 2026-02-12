import { requireSeller } from '@/lib/auth-guard';
import { AuthGuard } from '@/components/AuthGuard';
import { getVendorPayouts, calculateVendorPendingAmount } from '@/services/payout.service';
import { Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SellerPayoutsPage() {
  const user = await requireSeller();

  const [payouts, pendingAmount] = await Promise.all([
    getVendorPayouts(user.id),
    calculateVendorPendingAmount(user.id),
  ]);

  return (
    <AuthGuard requiredRole="seller">
      <div className="bg-gray-50 min-h-full">
        <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex items-center gap-shamar-16 mb-2">
              <div className="p-3 bg-success-500/20 rounded-shamar-md">
                <Wallet className="text-success-500" size={32} />
              </div>
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                  Mes <span className="text-primary-600">paiements</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium mt-1">
                  Historique des paiements et versements
                </p>
              </div>
            </div>
          </div>

          {pendingAmount > 0 && (
            <div className="bg-success-500/10 border border-success-500/30 rounded-shamar-md p-shamar-24">
              <p className="font-semibold text-success-700 text-shamar-body">Montant en attente</p>
              <p className="text-shamar-h2 font-semibold text-gray-900 mt-1">{pendingAmount.toLocaleString()} FCFA</p>
            </div>
          )}

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
            <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Historique des versements</h2>
            {payouts.length === 0 ? (
              <div className="text-center py-shamar-48">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                  <Wallet className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium text-shamar-body">Aucun paiement pour le moment.</p>
                <p className="text-gray-500 text-shamar-small mt-2">Vos futurs versements apparaîtront ici.</p>
              </div>
            ) : (
              <div className="space-y-0 divide-y divide-gray-200">
                {payouts.map((p) => (
                  <div
                    key={p.id}
                    className="flex justify-between items-center py-shamar-16 first:pt-0"
                  >
                    <div>
                      <span className="font-medium text-gray-900 text-shamar-body">
                        {p.amount.toLocaleString()} {p.currency}
                      </span>
                      <span className="ml-2 text-shamar-small text-gray-500">
                        {p.period_start} — {p.period_end}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold ${
                      p.status === 'sent' ? 'bg-success-500/20 text-emerald-700' :
                      p.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-warning-500/20 text-amber-700'
                    }`}>
                      {p.status === 'sent' ? 'Envoyé' : p.status === 'failed' ? 'Échoué' : 'En attente'}
                    </span>
                  </div>
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
