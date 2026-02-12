import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft, CheckCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminChinaSuppliersPage() {
  const supabase = await createClient();
  const { data: shops } = await (supabase as any)
    .from('shops')
    .select('id, name, country, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const list = shops || [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-24">
          <Link href="/admin/china/dashboard" className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium">
            <ArrowLeft size={16} /> Admin Chine
          </Link>
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Fournisseurs Sourcing Chine</h1>
          <p className="text-shamar-body text-gray-500">Validation fournisseurs, KYC.</p>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 overflow-hidden shadow-shamar-soft">
            <table className="w-full text-shamar-small">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Nom</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Pays</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Statut</th>
                  <th className="text-left p-shamar-16 font-semibold text-gray-700">Créé</th>
                </tr>
              </thead>
              <tbody>
                {list.map((s: any) => (
                  <tr key={s.id} className="border-b border-gray-100">
                    <td className="p-shamar-16 font-medium text-gray-900">{s.name}</td>
                    <td className="p-shamar-16 text-gray-600">{s.country || '—'}</td>
                    <td className="p-shamar-16">
                      {s.status === 'verified' ? (
                        <span className="inline-flex items-center gap-1 text-primary-600 font-medium"><CheckCircle size={14} /> Vérifié</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-shamar-sm bg-gray-100 text-gray-800">{s.status}</span>
                      )}
                    </td>
                    <td className="p-shamar-16 text-gray-500">{s.created_at ? new Date(s.created_at).toLocaleDateString('fr-FR') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {list.length === 0 && (
              <p className="p-shamar-24 text-center text-gray-500">Aucun fournisseur.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
