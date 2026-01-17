import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { FileText } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Portail <span className="text-amber-600">RFQ</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Demandes de devis et propositions commerciales
              </p>
            </div>
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              Créer une demande de devis
            </button>
          </div>
        </div>

        {offers && offers.length > 0 ? (
          <div className="space-y-4">
            {offers.map((offer: any) => (
              <div
                key={offer.id}
                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 mb-2">{offer.title || 'Sans titre'}</h3>
                    {offer.description && (
                      <p className="text-slate-600 font-medium mb-4">{offer.description}</p>
                    )}
                    <span className="text-sm text-slate-400 font-medium">
                      {new Date(offer.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-black ${
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
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Aucune demande de devis</p>
          </div>
        )}
      </div>
    </div>
  );
}
