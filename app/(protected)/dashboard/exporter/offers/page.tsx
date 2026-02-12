import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getInternationalOffersBySupplier } from '@/services/international.service';
import { Package, Plus } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ExporterOffersPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const offers = await getInternationalOffersBySupplier(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Mes offres</h1>
            <Link href="/dashboard/exporter/offers/new" className="inline-flex items-center gap-2 px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700">
              <Plus size={20} /> Nouvelle offre
            </Link>
          </div>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {offers.length > 0 ? (
              <div className="space-y-shamar-16">
                {offers.map((o: any) => (
                  <Link key={o.id} href={`/international/${o.id}`} className="block p-shamar-16 rounded-shamar-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <p className="font-semibold text-gray-900">{o.product}</p>
                    <p className="text-shamar-small text-gray-500">MOQ {o.moq} {o.moq_unit} • {o.price_bulk} {o.currency}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <Package className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium">Aucune offre publiée</p>
                <Link href="/dashboard/exporter/offers/new" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
                  Publier votre première offre
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
