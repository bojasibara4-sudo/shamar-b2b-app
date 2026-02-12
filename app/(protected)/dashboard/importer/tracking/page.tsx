import { getCurrentUser } from '@/lib/auth';
import Link from 'next/link';
import { getInternationalContractsByBuyer } from '@/services/international.service';
import { MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ImporterTrackingPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const trackings = await getInternationalContractsByBuyer(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Suivi logistique</h1>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {trackings.length > 0 ? (
              <div className="space-y-shamar-16">
                {trackings.map((t: any) => (
                  <Link key={t.id} href={`/international/tracking/${t.offer_id}`} className="block p-shamar-16 rounded-shamar-md bg-gray-50 hover:bg-gray-100 transition-colors">
                    <p className="font-semibold text-gray-900">{t.international_offers?.product ?? 'Suivi'}</p>
                    <p className="text-shamar-small text-gray-500">{t.status}</p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium">Aucun suivi actif</p>
                <Link href="/international" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
                  Passer une commande
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
