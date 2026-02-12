import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RFQPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: offers } = await supabase
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Portail <span className="text-primary-600">RFQ</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Demandes de devis et propositions commerciales
              </p>
            </div>
            <Link href="/rfq/new" className="inline-flex items-center justify-center bg-primary-600 text-white px-shamar-24 py-3 rounded-shamar-md font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
              Créer une demande de devis
            </Link>
          </div>
        </div>

        {offers && offers.length > 0 ? (
          <div className="space-y-shamar-16">
            {offers.map((offer: any) => (
              <Link
                key={offer.id}
                href={`/negociation/${offer.id}`}
                className="block bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 hover:shadow-shamar-medium hover:border-primary-600/30 transition-all"
              >
                <div className="flex justify-between items-start mb-shamar-16">
                  <div className="flex-1">
                    <h3 className="text-shamar-h3 text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{offer.title || 'Sans titre'}</h3>
                    {offer.description && (
                      <p className="text-gray-500 font-medium mb-shamar-16 text-shamar-body">{offer.description}</p>
                    )}
                    <span className="text-shamar-small text-gray-500 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {new Date(offer.created_at).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <span className={`px-shamar-16 py-2 rounded-shamar-sm text-shamar-small font-semibold border ${
                    offer.status === 'accepted' ? 'bg-success-500/20 text-gray-800 border-success-500/30' :
                    offer.status === 'rejected' ? 'bg-danger-500/20 text-gray-800 border-danger-500/30' :
                    'bg-warning-500/20 text-gray-800 border-warning-500/30'
                  }`}>
                    {offer.status || 'En attente'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-48 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium text-shamar-body">Aucune demande de devis</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
