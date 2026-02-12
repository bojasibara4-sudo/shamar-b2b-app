import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import RfqClient from '@/components/marketplace/RfqClient';

export const dynamic = 'force-dynamic';

export default async function ChinaRfqDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { id } = await params;
  const supabase = await createClient();
  const { data: rfq, error } = await (supabase as any)
    .from('product_rfqs')
    .select(`
      *,
      product:products(id, name, description, price, currency, image_url, seller_id),
      buyer:users!product_rfqs_buyer_id_fkey(id, email, full_name, company_name),
      seller:users!product_rfqs_seller_id_fkey(id, email, full_name, company_name)
    `)
    .eq('id', id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .single();

  if (error || !rfq) notFound();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <Link href="/china/rfqs" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            ← Retour aux RFQ
          </Link>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
              Demande de devis — {rfq.product?.name || `RFQ ${id.slice(0, 8)}`}
            </h1>
            <p className="text-shamar-body text-gray-500 mt-1">Infos demande, offres fournisseurs, comparer, accepter, convertir en commande.</p>
          </div>
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <RfqClient rfqId={id} initialRfq={rfq} currentUserId={user.id} />
          </div>
          <div className="flex flex-wrap gap-shamar-16">
            <Link href={`/china/negotiation/${id}`} className="text-primary-600 font-semibold hover:underline">
              Ouvrir la négociation →
            </Link>
            <Link href="/china/orders" className="text-gray-600 font-medium hover:underline">
              Mes commandes
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
