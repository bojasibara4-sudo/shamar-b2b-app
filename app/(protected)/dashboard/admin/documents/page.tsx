import { requireAdmin } from '@/lib/auth-guard';
import { getPendingDocuments } from '@/services/document.service';
import { createClient } from '@/lib/supabase/server';
import { FileCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDocumentsPage() {
  await requireAdmin();

  const pendingDocs = await getPendingDocuments();

  const supabase = await createClient();
  const { data: allDocs } = await (supabase as any)
    .from('documents')
    .select(`
      *,
      vendor:vendors!documents_vendor_id_fkey(
        id,
        user:users!vendors_user_id_fkey(email, full_name, company_name)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  const documents = allDocs || [];

  return (
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex items-center gap-shamar-16 mb-2">
            <div className="p-3 bg-primary-100 rounded-shamar-md">
              <FileCheck className="text-primary-600" size={32} />
            </div>
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight">
                Validation des <span className="text-primary-600">documents</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium mt-1">
                Documents KYC et légaux des vendeurs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-32">
          {pendingDocs.length > 0 && (
            <p className="text-amber-600 font-semibold mb-shamar-16 text-shamar-body">{pendingDocs.length} document(s) en attente</p>
          )}
          <h2 className="text-shamar-h3 font-semibold text-gray-900 mb-shamar-16">Documents</h2>
          {documents.length === 0 ? (
            <div className="text-center py-shamar-48">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-shamar-24">
                <FileCheck className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium text-shamar-body">Aucun document.</p>
            </div>
          ) : (
            <div className="space-y-0 divide-y divide-gray-200">
              {documents.map((doc: any) => (
                <div
                  key={doc.id}
                  className="flex justify-between items-center py-shamar-16 first:pt-0"
                >
                  <div>
                    <span className="font-medium text-gray-900 text-shamar-body">{doc.type}</span>
                    <span className="ml-2 text-shamar-small text-gray-500">
                      — Vendor #{doc.vendor_id?.slice(0, 8)}
                    </span>
                  </div>
                  <span className={`px-3 py-1 rounded-shamar-sm text-shamar-small font-semibold ${
                    doc.status === 'approved' ? 'bg-success-500/20 text-emerald-700' :
                    doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                    'bg-warning-500/20 text-amber-700'
                  }`}>
                    {doc.status === 'pending' ? 'En attente' : doc.status === 'approved' ? 'Approuvé' : 'Rejeté'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
