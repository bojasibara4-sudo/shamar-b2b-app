import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getNegoceRFQsByBuyer } from '@/services/negoce.service';

export const dynamic = 'force-dynamic';

export default async function NegoceBuyerRFQsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const rfqs = await getNegoceRFQsByBuyer(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Mes demandes de devis</h1>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {rfqs.length > 0 ? (
              rfqs.map((r: any) => (
                <div key={r.id} className="p-shamar-16 rounded-shamar-md bg-gray-50 mb-shamar-16 last:mb-0">
                  <p className="font-semibold text-gray-900">{r.negoce_offers?.product ?? 'RFQ'}</p>
                  <p className="text-shamar-small text-gray-500">Qté {r.quantity}</p>
                </div>
              ))
            ) : (
              <div className="text-center py-shamar-48">
                <p className="text-gray-500 font-medium">Aucune demande</p>
                <Link href="/negoce" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">Demander un devis</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
