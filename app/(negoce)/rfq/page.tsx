import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function RFQPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  
  // Récupérer les RFQ (offers)
  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Portail RFQ - Demandes de Devis
      </h1>

      <div className="mb-6">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
          Créer une demande de devis
        </button>
      </div>

      {offers && offers.length > 0 ? (
        <div className="space-y-4">
          {offers.map((offer: any) => (
            <div
              key={offer.id}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <h3 className="font-semibold text-lg mb-2">{offer.title || 'Sans titre'}</h3>
              {offer.description && (
                <p className="text-gray-600 mb-4">{offer.description}</p>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  {new Date(offer.created_at).toLocaleDateString()}
                </span>
                <span className={`px-2 py-1 rounded text-sm ${
                  offer.status === 'accepted'
                    ? 'bg-emerald-100 text-emerald-700'
                    : offer.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {offer.status || 'En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-500">Aucune demande de devis</p>
        </div>
      )}
    </div>
  );
}
