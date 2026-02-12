import { getCurrentUser } from '@/lib/auth';
import { getInternationalRFQsBySupplier } from '@/services/international.service';
import { Inbox } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ExporterRFQsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const rfqs = await getInternationalRFQsBySupplier(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Demandes reçues</h1>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {rfqs.length > 0 ? (
              <div className="space-y-shamar-16">
                {rfqs.map((r: any) => (
                  <div key={r.id} className="p-shamar-16 rounded-shamar-md bg-gray-50">
                    <p className="font-semibold text-gray-900">{r.international_offers?.product ?? 'RFQ'}</p>
                    <p className="text-shamar-small text-gray-500">{r.international_offers?.supplier_name ?? ''} • Qté {r.quantity}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <Inbox className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium">Aucune demande pour le moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
