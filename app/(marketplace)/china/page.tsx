import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, Shield, Truck, CheckCircle, Package, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Sourcing Chine — Importer depuis la Chine simplement',
  description: 'Fournisseurs vérifiés, escrow sécurisé, logistique maritime et aérienne. Sourcing Chine → Afrique.',
};

const CATEGORIES = [
  { slug: 'electronique', label: 'Électronique' },
  { slug: 'textile', label: 'Textile' },
  { slug: 'machines', label: 'Machines & équipements' },
  { slug: 'mobilier', label: 'Mobilier' },
  { slug: 'emballage', label: 'Emballage' },
  { slug: 'autre', label: 'Autres' },
];

const STEPS = [
  { title: 'Demande devis', desc: 'Décrivez votre besoin, recevez des offres' },
  { title: 'Négociation', desc: 'Comparez et négociez avec les fournisseurs' },
  { title: 'Escrow', desc: 'Paiement sécurisé, déblocage à la livraison' },
  { title: 'Production', desc: 'Suivi fabrication en Chine' },
  { title: 'Livraison Afrique', desc: 'Logistique maritime ou aérienne jusqu\'à vous' },
];

export default async function ChinaLandingPage() {
  const supabase = await createClient();
  const { data: products } = await (supabase as any)
    .from('products')
    .select('id, name, price, currency, image_url, category')
    .eq('status', 'active')
    .or('description.ilike.%chine%,description.ilike.%china%,category.ilike.%chine%')
    .limit(8);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        {/* Hero */}
        <section className="text-center py-shamar-48 md:py-shamar-64">
          <h1 className="text-shamar-h1 md:text-4xl font-bold text-gray-900 tracking-tight mb-shamar-16">
            Importer depuis la <span className="text-primary-600">Chine</span> simplement
          </h1>
          <p className="text-shamar-body text-gray-600 max-w-2xl mx-auto mb-shamar-32">
            Fournisseurs vérifiés, demande de devis en quelques clics, paiement escrow sécurisé et logistique jusqu&apos;en Afrique.
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 px-shamar-32 py-shamar-16 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700 transition-colors"
          >
            Créer un compte <ArrowRight size={20} />
          </Link>
        </section>

        {/* Catégories */}
        <section className="py-shamar-32">
          <h2 className="text-shamar-h2 text-gray-900 mb-shamar-24">Catégories produits Chine</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-shamar-16">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/china/categories?cat=${c.slug}`}
                className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft hover:border-primary-600/30 hover:shadow-shamar-medium transition-all text-center"
              >
                <span className="font-medium text-gray-900 text-shamar-body">{c.label}</span>
              </Link>
            ))}
          </div>
          <p className="mt-shamar-16 text-shamar-small text-gray-500">
            <Link href="/china/categories" className="text-primary-600 font-medium hover:underline">Voir toutes les catégories</Link>
          </p>
        </section>

        {/* Process */}
        <section className="py-shamar-32">
          <h2 className="text-shamar-h2 text-gray-900 mb-shamar-24">Comment ça marche</h2>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <ol className="space-y-shamar-24">
              {STEPS.map((step, i) => (
                <li key={i} className="flex gap-shamar-16">
                  <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-600 text-gray-0 flex items-center justify-center font-semibold text-shamar-body">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-shamar-small text-gray-500 mt-1">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
            <Link href="/china/how-it-works" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
              Détail des étapes →
            </Link>
          </div>
        </section>

        {/* Sécurité escrow + Logistique */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-shamar-24 py-shamar-32">
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <Shield className="h-12 w-12 text-primary-600 mb-shamar-16" />
            <h3 className="text-shamar-h3 text-gray-900 mb-2">Sécurité escrow</h3>
            <p className="text-shamar-body text-gray-500">
              Les fonds sont bloqués jusqu&apos;à réception et confirmation. En cas de litige, notre équipe arbitre.
            </p>
          </div>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <Truck className="h-12 w-12 text-primary-600 mb-shamar-16" />
            <h3 className="text-shamar-h3 text-gray-900 mb-2">Logistique maritime / aérienne</h3>
            <p className="text-shamar-body text-gray-500">
              Suivi de l&apos;expédition jusqu&apos;à votre entrepôt. FOB, CIF, EXW selon vos besoins.
            </p>
          </div>
        </section>

        {/* Fournisseurs vérifiés */}
        <section className="py-shamar-32">
          <h2 className="text-shamar-h2 text-gray-900 mb-shamar-24 flex items-center gap-2">
            <CheckCircle className="text-primary-600" size={28} /> Fournisseurs vérifiés
          </h2>
          <p className="text-shamar-body text-gray-500 mb-shamar-24">
            Partenaires chinois audités : MOQ, délais, certificats. Consultez l&apos;annuaire et demandez un devis.
          </p>
          <Link
            href="/china/suppliers"
            className="inline-flex items-center gap-2 px-shamar-24 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700"
          >
            Voir l&apos;annuaire fournisseurs <ArrowRight size={18} />
          </Link>
        </section>

        {/* Produits Chine (aperçu) */}
        {(products && products.length > 0) && (
          <section className="py-shamar-32">
            <h2 className="text-shamar-h2 text-gray-900 mb-shamar-24">Aperçu produits</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-shamar-24">
              {products.slice(0, 4).map((p: any) => (
                <Link
                  key={p.id}
                  href={`/products/${p.id}`}
                  className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft hover:border-primary-600/30 transition-all group"
                >
                  <div className="h-32 bg-gray-100 flex items-center justify-center">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="text-gray-400" size={40} />
                    )}
                  </div>
                  <div className="p-shamar-16">
                    <p className="font-medium text-gray-900 text-shamar-small line-clamp-2">{p.name}</p>
                    <p className="text-primary-600 font-semibold text-shamar-caption mt-1">
                      {Number(p.price || 0).toLocaleString()} {p.currency || 'FCFA'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href="/china/categories" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
              Parcourir les catégories →
            </Link>
          </section>
        )}

        {/* CTA final */}
        <section className="py-shamar-48 text-center bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
          <h2 className="text-shamar-h2 text-gray-900 mb-2">Prêt à sourcer en Chine ?</h2>
          <p className="text-shamar-body text-gray-500 mb-shamar-24">Créez votre compte et déposez votre première demande de devis.</p>
          <div className="flex flex-wrap justify-center gap-shamar-16">
            <Link href="/auth/register" className="px-shamar-32 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700">
              Créer un compte
            </Link>
            <Link href="/china/dashboard" className="px-shamar-32 py-shamar-12 border border-primary-600 text-primary-600 font-semibold rounded-shamar-md hover:bg-primary-50">
              Espace acheteur
            </Link>
            <Link href="/china/how-it-works" className="px-shamar-32 py-shamar-12 border border-gray-200 text-gray-700 font-semibold rounded-shamar-md hover:bg-gray-50">
              Comment ça marche
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
