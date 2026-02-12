import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { getVendorTransactions } from '@/services/commission.service';

export const dynamic = 'force-dynamic';

export default async function SellerCommissionsPage() {
  const user = await requireSeller();

  const transactions = await getVendorTransactions(user.id);
  const totalRevenue = transactions.reduce(
    (sum: number, t: any) => sum + (Number(t.amount || 0) - Number(t.commission_amount || 0)),
    0
  );
  const totalCommissions = transactions.reduce(
    (sum: number, t: any) => sum + Number(t.commission_amount || 0),
    0
  );

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
              <div>
                <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                  Mes <span className="text-primary-600">Commissions</span>
                </h1>
                <p className="text-shamar-body text-gray-500 font-medium">
                  Suivez vos revenus et commissions
                </p>
              </div>
              <LogoutButton />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-shamar-24">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 hover:shadow-shamar-medium transition-all">
              <h2 className="text-shamar-h4 text-gray-900 mb-2">
                Revenu total
              </h2>
              <p className="text-shamar-h1 font-bold text-primary-600">
                {totalRevenue.toFixed(2)} €
              </p>
              <p className="text-shamar-small text-gray-500 mt-1 font-medium">
                Montant après commission plateforme
              </p>
            </div>

            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 hover:shadow-shamar-medium transition-all">
              <h2 className="text-shamar-h4 text-gray-900 mb-2">
                Commission plateforme
              </h2>
              <p className="text-shamar-h1 font-bold text-gray-700">
                {totalCommissions.toFixed(2)} €
              </p>
              <p className="text-shamar-small text-gray-500 mt-1 font-medium">
                Commission prélevée (10%)
              </p>
            </div>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24">
            <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">
              Détail des commissions
            </h2>
            {transactions.length === 0 ? (
              <p className="text-gray-500 text-center py-shamar-48 font-medium">Aucune commission</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-shamar-16 py-3 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                        Commande
                      </th>
                      <th className="px-shamar-16 py-3 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-shamar-16 py-3 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                        Commission
                      </th>
                      <th className="px-shamar-16 py-3 text-left text-shamar-caption font-semibold text-gray-700 uppercase tracking-wider">
                        Revenu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-0 divide-y divide-gray-200">
                    {transactions.map((t: any) => {
                      const amount = Number(t.amount || 0);
                      const comm = Number(t.commission_amount || 0);
                      const revenue = amount - comm;
                      return (
                        <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-shamar-16 py-4 whitespace-nowrap text-shamar-body text-gray-600 font-medium">
                            #{t.order_id?.slice(0, 8) ?? t.id?.slice(0, 8)}…
                          </td>
                          <td className="px-shamar-16 py-4 whitespace-nowrap text-shamar-body font-semibold text-gray-900">
                            {amount.toFixed(2)} €
                          </td>
                          <td className="px-shamar-16 py-4 whitespace-nowrap text-shamar-body font-semibold text-gray-700">
                            -{comm.toFixed(2)} €
                          </td>
                          <td className="px-shamar-16 py-4 whitespace-nowrap text-shamar-body font-semibold text-primary-600">
                            {revenue.toFixed(2)} €
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

