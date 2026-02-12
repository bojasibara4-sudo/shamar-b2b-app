import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getNegoceContractsByBuyer } from '@/services/negoce.service';

export const dynamic = 'force-dynamic';

export default async function NegoceBuyerContractsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const contracts = await getNegoceContractsByBuyer(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Mes contrats</h1>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {contracts.length > 0 ? (
              <div className="space-y-shamar-16">
                {contracts.map((c: any) => (
                  <Link key={c.id} href={`/negoce/contract/${c.offer_id}`} className="block p-shamar-16 rounded-shamar-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <p className="font-semibold text-gray-900">{c.negoce_offers?.product ?? 'Contrat'}</p>
                    <p className="text-shamar-small text-gray-500">{c.negoce_offers?.supplier_name ?? ''} • {c.total_amount} {c.currency}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <p className="text-gray-500">Aucun contrat</p>
                <Link href="/negoce" className="inline-block mt-shamar-16 text-primary-600 font-semibold hover:underline">Rechercher des fournisseurs</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
