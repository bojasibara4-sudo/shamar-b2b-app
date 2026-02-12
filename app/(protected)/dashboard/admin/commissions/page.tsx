import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import {
  getCommissionsForAdmin,
  getTotalCommissionsPlatform,
} from '@/services/commission.service';
import { getUsersForAdmin } from '@/services/user.service';

export const dynamic = 'force-dynamic';

type CommissionRow = {
  id: string;
  order_id: string;
  seller_id: string;
  amount: number;
  commission_amount: number;
  seller_revenue: number;
  status: string;
  created_at: string;
};

type CommissionBySeller = {
  sellerId: string;
  totalRevenue: number;
  totalCommission: number;
  commissions: CommissionRow[];
};

export default async function AdminCommissionsPage() {
  await requireAdmin();

  const [commissions, totalCommissions, allUsers] = await Promise.all([
    getCommissionsForAdmin(),
    getTotalCommissionsPlatform(),
    getUsersForAdmin(),
  ]);
  const userMap = new Map(allUsers.map((u) => [u.id, u.email]));

  const commissionsBySeller = (commissions as CommissionRow[]).reduce<
    Record<string, CommissionBySeller>
  >((acc, c) => {
    const sid = c.seller_id;
    if (!acc[sid]) {
      acc[sid] = {
        sellerId: sid,
        totalRevenue: 0,
        totalCommission: 0,
        commissions: [],
      };
    }
    acc[sid].totalRevenue += c.seller_revenue;
    acc[sid].totalCommission += c.commission_amount;
    acc[sid].commissions.push(c);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Gestion des <span className="text-orange-600">Commissions</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Suivez les commissions de la plateforme
              </p>
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900">
              Total des commissions
            </h2>
            <p className="text-3xl font-black text-slate-900">
              {totalCommissions.toFixed(2)} €
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6">
          <h2 className="text-xl font-black text-slate-900 mb-4">
            Commissions par vendeur
          </h2>
          {Object.keys(commissionsBySeller).length === 0 ? (
          <p className="text-slate-500 text-center py-12 font-medium">Aucune commission</p>
        ) : (
          <div className="space-y-4">
            {Object.values(commissionsBySeller).map((sellerData) => (
              <div
                key={sellerData.sellerId}
                className="border border-slate-200 rounded-[1.5rem] p-6 hover:shadow-lg transition-all"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-black text-slate-900 text-lg">
                      {userMap.get(sellerData.sellerId) || sellerData.sellerId}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      {sellerData.commissions.length} commission(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500 font-medium">Revenu vendeur</p>
                    <p className="text-xl font-black text-emerald-600">
                      {sellerData.totalRevenue.toFixed(2)} €
                    </p>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Commission</p>
                    <p className="text-xl font-black text-blue-600">
                      {sellerData.totalCommission.toFixed(2)} €
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2 pt-4 border-t border-slate-100">
                  {sellerData.commissions.map((commission) => (
                    <div
                      key={commission.id}
                      className="flex justify-between text-sm bg-slate-50 p-3 rounded-xl border border-slate-100"
                    >
                      <div>
                        <p className="font-black text-slate-900">
                          Commande #{commission.order_id.slice(0, 8)}…
                        </p>
                        <p className="text-xs text-slate-500 font-medium">
                          {new Date(commission.created_at).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-slate-900 font-black">
                          {commission.seller_revenue.toFixed(2)} €
                        </p>
                        <p className="text-xs text-blue-600 font-black">
                          +{commission.commission_amount.toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

