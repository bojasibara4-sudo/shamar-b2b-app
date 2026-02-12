import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { CheckCircle, MapPin, Package } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaSuppliersPage() {
  const supabase = await createClient();
  const { data: shops } = await (supabase as any)
    .from('shops')
    .select('id, name, description, city, country, status, image_url, category')
    .eq('status', 'verified')
    .order('name')
    .limit(50);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <Link href="/china" className="text-shamar-small text-gray-500 hover:text-primary-600 font-medium mb-shamar-16 inline-block">
              ← Retour Sourcing Chine
            </Link>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Annuaire fournisseurs chinois</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Partenaires vérifiés : MOQ, ville/province, spécialité. Demandez un devis en un clic.</p>
          </div>

          {shops && shops.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-shamar-24">
              {shops.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/china/supplier/${s.id}`}
                  className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-600/30 hover:shadow-shamar-medium transition-all block"
                >
                  <div className="flex items-start gap-shamar-16">
                    <div className="w-14 h-14 rounded-shamar-md bg-primary-100 flex items-center justify-center shrink-0">
                      {s.image_url ? (
                        <img src={s.image_url} alt={s.name} className="w-full h-full object-cover rounded-shamar-md" />
                      ) : (
                        <Package className="text-primary-600" size={28} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-gray-900 text-shamar-body truncate">{s.name}</h2>
                      {(s.city || s.country) && (
                        <p className="text-shamar-small text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin size={14} /> {[s.city, s.country].filter(Boolean).join(', ')}
                        </p>
                      )}
                      {s.category && (
                        <p className="text-shamar-caption text-gray-500 mt-1">Spécialité : {s.category}</p>
                      )}
                      <span className="inline-flex items-center gap-1 mt-shamar-12 text-shamar-caption font-medium text-primary-600">
                        <CheckCircle size={14} /> Vérifié
                      </span>
                    </div>
                  </div>
                  <p className="mt-shamar-16 text-shamar-small text-gray-600 line-clamp-2">{s.description}</p>
                  <span className="inline-block mt-shamar-16 text-primary-600 font-semibold text-shamar-small hover:underline">
                    Voir profil →
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 text-center shadow-shamar-soft">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-shamar-16" />
              <p className="text-gray-500 font-medium">Aucun fournisseur vérifié pour le moment.</p>
              <Link href="/china" className="inline-block mt-shamar-16 text-primary-600 font-semibold hover:underline">
                Retour à l&apos;accueil Sourcing Chine
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
