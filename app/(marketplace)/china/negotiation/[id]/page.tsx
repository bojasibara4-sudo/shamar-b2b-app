import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ArrowLeft, MessageSquare, FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaNegotiationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const { id } = await params;
  const supabase = await createClient();
  const { data: rfq } = await (supabase as any)
    .from('product_rfqs')
    .select('id, product_id, status')
    .eq('id', id)
    .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
    .single();

  if (!rfq) notFound();

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <Link href="/china/negotiations" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Retour aux négociations
          </Link>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight flex items-center gap-2">
              <MessageSquare size={28} className="text-primary-600" /> Négociation — RFQ {id.slice(0, 8)}
            </h1>
            <p className="text-shamar-body text-gray-500 mt-1">Messagerie, fichiers, modification prix, contre-offres, historique.</p>
          </div>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            <p className="text-gray-600 mb-shamar-24">Zone de messagerie et pièces jointes à connecter (API messages / RFQ).</p>
            <Link
              href={`/china/rfq/${id}`}
              className="inline-flex items-center gap-2 text-primary-600 font-semibold hover:underline"
            >
              <FileText size={18} /> Voir le détail de la RFQ
            </Link>
          </div>

          <div className="flex flex-wrap gap-shamar-16">
            <Link
              href={`/china/order/new?rfq=${id}`}
              className="inline-flex items-center gap-2 px-shamar-24 py-shamar-12 bg-primary-600 text-gray-0 font-semibold rounded-shamar-md hover:bg-primary-700"
            >
              Créer une commande
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
