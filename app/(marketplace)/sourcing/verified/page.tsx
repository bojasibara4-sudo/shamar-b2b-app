import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

/**
 * /sourcing/verified — Fournisseurs validés (partenaires Shamar).
 */
export default async function SourcingVerifiedPage() {
  const supabase = await createClient();
  const { data: shops } = await (supabase as any).from('shops').select('id, name, country, status, image_url').eq('status', 'verified').limit(24);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <Link href="/sourcing" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-600 text-shamar-small mb-shamar-24">
        <ArrowLeft size={16} /> Retour au hub Sourcing
      </Link>
      <h1 className="text-shamar-h2 text-gray-900 flex items-center gap-2">
        <ShieldCheck size={28} className="text-primary-600" /> Fournisseurs validés
      </h1>
      <p className="mt-1 text-shamar-body text-gray-500">Partenaires officiels Shamar — Chine, Afrique. Badges premium, contrats Shamar.</p>

      <div className="mt-shamar-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-shamar-24">
        {Array.isArray(shops) && shops.length > 0 ? (
          shops.map((s: { id: string; name: string; country?: string }) => (
            <Link key={s.id} href={`/sourcing/suppliers/${s.id}`} className="p-shamar-24 rounded-shamar-md border border-gray-200 hover:bg-gray-50 hover:border-primary-600/30 transition-colors bg-gray-0 shadow-shamar-soft">
              <span className="font-semibold text-gray-900 text-shamar-body">{s.name}</span>
              {s.country && <p className="text-shamar-small text-gray-500 mt-1">{s.country}</p>}
              <span className="inline-block mt-2 text-shamar-caption font-medium text-primary-600">Partenaire vérifié</span>
            </Link>
          ))
        ) : (
          <div className="col-span-full p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 text-gray-600 shadow-shamar-soft">
            Aucun fournisseur validé affiché. Les boutiques avec statut « verified » apparaîtront ici. <Link href="/sourcing/search" className="text-primary-600 hover:underline">Rechercher des fournisseurs</Link>.
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
