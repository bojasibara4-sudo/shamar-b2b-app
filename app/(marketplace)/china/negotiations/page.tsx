import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ChinaNegotiationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const supabase = await createClient();
  const { data: rfqs } = await (supabase as any)
    .from('product_rfqs')
    .select('id, created_at, status')
    .eq('buyer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const list = rfqs || [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32">
          <div>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Négociations</h1>
            <p className="text-shamar-body text-gray-500 mt-1">Conversations ouvertes avec les fournisseurs.</p>
          </div>

          {list.length > 0 ? (
            <ul className="space-y-shamar-12">
              {list.map((r: any) => (
                <li key={r.id}>
                  <Link
                    href={`/china/negotiation/${r.id}`}
                    className="block p-shamar-24 rounded-shamar-md border border-gray-200 bg-gray-0 shadow-shamar-soft hover:border-primary-600/30 hover:shadow-shamar-medium transition-all"
                  >
                    <div className="flex items-center gap-shamar-16">
                      <div className="w-12 h-12 rounded-shamar-md bg-primary-100 text-primary-600 flex items-center justify-center">
                        <MessageSquare size={24} />
                      </div>
                      <div>
                        <span className="font-semibold text-gray-900">RFQ {r.id.slice(0, 8)}</span>
                        <span className="text-shamar-small text-gray-500 ml-2">— {r.status || 'En cours'}</span>
                      </div>
                      <span className="ml-auto text-shamar-small text-gray-500">
                        {r.created_at ? new Date(r.created_at).toLocaleDateString('fr-FR') : ''}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-48 text-center shadow-shamar-soft">
              <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-shamar-16" />
              <p className="text-gray-500 font-medium">Aucune négociation en cours.</p>
              <Link href="/china/rfq/create" className="inline-block mt-shamar-24 text-primary-600 font-semibold hover:underline">
                Créer une demande de devis
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
