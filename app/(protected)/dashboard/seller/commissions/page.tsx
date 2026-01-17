import { requireSeller } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { commissionsDB } from '@/lib/mock-data';

export const dynamic = 'force-dynamic';

export default async function SellerCommissionsPage() {
  const user = await requireSeller();

  const commissions = commissionsDB.getBySellerId(user.id);
  const totalRevenue = commissionsDB.getTotalBySellerId(user.id);
  const totalCommissions = commissions.reduce(
    (sum, c) => sum + c.commissionAmount,
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Mes <span className="text-indigo-600">Commissions</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Suivez vos revenus et commissions
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 hover:shadow-xl transition-all">
            <h2 className="text-lg font-black text-slate-900 mb-2">
              Revenu total
            </h2>
            <p className="text-3xl font-black text-emerald-600">
              {totalRevenue.toFixed(2)} €
            </p>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Montant après commission plateforme
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 hover:shadow-xl transition-all">
            <h2 className="text-lg font-black text-slate-900 mb-2">
              Commission plateforme
            </h2>
            <p className="text-3xl font-black text-blue-600">
              {totalCommissions.toFixed(2)} €
            </p>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Commission prélevée (10%)
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-black text-slate-900 mb-4">
            Détail des commissions
          </h2>
          {commissions.length === 0 ? (
          <p className="text-slate-500 text-center py-12 font-medium">Aucune commission</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                    Quantité
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-black text-slate-700 uppercase tracking-wider">
                    Revenu
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {commissions.map((commission) => (
                  <tr key={commission.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                      {commission.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      #{commission.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                      {commission.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-slate-900">
                      {commission.productTotal.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-blue-600">
                      -{commission.commissionAmount.toFixed(2)} €
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-emerald-600">
                      {commission.sellerRevenue.toFixed(2)} €
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

