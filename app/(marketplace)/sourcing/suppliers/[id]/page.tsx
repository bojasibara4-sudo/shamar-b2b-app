import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function SourcingSupplierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: shop } = await (supabase as any).from('shops').select('id, name, description, city, country, status, image_url').eq('id', id).maybeSingle();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <Link href="/sourcing/search" className="inline-flex items-center gap-2 text-shamar-small font-medium text-gray-500 hover:text-primary-600 mb-shamar-16">
            <ArrowLeft size={16} /> Retour recherche
          </Link>
          <h1 className="text-shamar-h2 text-gray-900">{shop?.name || `Fournisseur ${id.slice(0, 8)}`}</h1>
          <p className="text-shamar-body text-gray-500">Présentation, certificats, photos usine, produits, capacités, MOQ, délais, badges, avis, score fiabilité.</p>
          <div className="flex flex-wrap gap-shamar-16">
            <Link href={`/sourcing/rfq/new?supplier=${id}`} className="px-shamar-24 py-3 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700">Demander un devis</Link>
            <Link href={`/shop/${id}`} className="px-shamar-24 py-3 border border-gray-200 rounded-shamar-md font-medium text-gray-700 hover:bg-gray-50">Voir la boutique</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
