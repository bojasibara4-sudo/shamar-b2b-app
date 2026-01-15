import { requireAdmin } from '@/lib/auth-guard';
import LogoutButton from '@/components/LogoutButton';
import { commissionsDB, usersDB } from '@/lib/mock-data';

export default async function AdminCommissionsPage() {
  requireAdmin();

  const commissions = commissionsDB.getAll();
  const totalCommissions = commissionsDB.getTotalCommissions();
  const allUsers = usersDB.getAll();
  const userMap = new Map(allUsers.map((u) => [u.id, u.email]));

  const commissionsBySeller = commissions.reduce(
    (acc, commission) => {
      if (!acc[commission.sellerId]) {
        acc[commission.sellerId] = {
          sellerId: commission.sellerId,
          totalRevenue: 0,
          totalCommission: 0,
          commissions: [],
        };
      }
      acc[commission.sellerId].totalRevenue += commission.sellerRevenue;
      acc[commission.sellerId].totalCommission += commission.commissionAmount;
      acc[commission.sellerId].commissions.push(commission);
      return acc;
    },
    {} as Record<
      string,
      {
        sellerId: string;
        totalRevenue: number;
        totalCommission: number;
        commissions: typeof commissions;
      }
    >
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Commissions
            </h1>
            <p className="mt-2 text-gray-600">
              Suivez les commissions de la plateforme
            </p>
          </div>
          <LogoutButton />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Total des commissions
          </h2>
          <p className="text-2xl font-bold text-gray-900">
            {totalCommissions.toFixed(2)} €
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Commissions par vendeur
        </h2>
        {Object.keys(commissionsBySeller).length === 0 ? (
          <p className="text-gray-600">Aucune commission</p>
        ) : (
          <div className="space-y-4">
            {Object.values(commissionsBySeller).map((sellerData) => (
              <div
                key={sellerData.sellerId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">
                      {userMap.get(sellerData.sellerId) || sellerData.sellerId}
                    </p>
                    <p className="text-sm text-gray-500">
                      {sellerData.commissions.length} commission(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Revenu vendeur</p>
                    <p className="text-lg font-bold text-green-600">
                      {sellerData.totalRevenue.toFixed(2)} €
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Commission</p>
                    <p className="text-lg font-bold text-blue-600">
                      {sellerData.totalCommission.toFixed(2)} €
                    </p>
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {sellerData.commissions.map((commission) => (
                    <div
                      key={commission.id}
                      className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {commission.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Commande #{commission.orderId} - Qté: {commission.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600">
                          {commission.sellerRevenue.toFixed(2)} €
                        </p>
                        <p className="text-xs text-blue-600">
                          +{commission.commissionAmount.toFixed(2)} €
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
  );
}

