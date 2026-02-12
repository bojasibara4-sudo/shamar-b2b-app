import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, FileText, ShoppingCart } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaOrderNewPage({
  searchParams,
}: {
  searchParams: Promise<{ rfq?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { rfq: rfqId } = await searchParams;
  if (!rfqId) redirect('/china/rfqs');

  const supabase = await createClient();
  const { data: rfq } = await (supabase as any)
    .from('product_rfqs')
    .select('id, product_id, status')
    .eq('id', rfqId)
    .eq('buyer_id', user.id)
    .single();

  if (!rfq) notFound();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <Link
            href={`/china/negotiation/${rfqId}`}
            className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium"
          >
            <ArrowLeft size={16} /> Retour à la négociation
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2">
              <ShoppingCart size={28} className="text-primary-600" /> Créer une commande
            </h1>
            <p className="text-shamar-body text-gray-500 mt-1">
              Création de commande à partir du devis RFQ {rfqId.slice(0, 8)}.
            </p>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <p className="text-gray-600 mb-shamar-24">
              Validez les informations du devis puis confirmez pour créer la commande. Le détail du devis et la conversion en commande sont disponibles sur la fiche RFQ.
            </p>
            <div className="flex flex-wrap gap-shamar-16">
              <Link
                href={`/china/rfq/${rfqId}`}
                className="inline-flex items-center gap-2 px-shamar-24 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700"
              >
                <FileText size={18} /> Voir le devis et créer la commande
              </Link>
              <Link href="/china/orders" className="text-gray-600 font-medium hover:underline">
                Mes commandes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
