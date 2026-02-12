import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getNegoceOffersBySupplier } from '@/services/negoce.service';

export const dynamic = 'force-dynamic';

export default async function NegoceSellerOffersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const offers = await getNegoceOffersBySupplier(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Mes offres</h1>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {offers.length > 0 ? (
              offers.map((o: any) => (
                <Link key={o.id} href={`/negoce/${o.id}`} className="block p-shamar-16 rounded-shamar-md bg-gray-50 hover:bg-gray-100 mb-shamar-16 last:mb-0 transition-colors">
                  <p className="font-semibold text-gray-900">{o.product}</p>
                  <p className="text-shamar-small text-gray-500">MOQ {o.moq} • {o.price_indicator} {o.currency}</p>
                </Link>
              ))
            ) : (
              <div className="text-center py-shamar-48">
                <p className="text-gray-500 font-medium">Aucune offre publiée</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
