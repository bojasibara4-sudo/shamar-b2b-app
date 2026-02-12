import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { getVendorIdByUserId } from '@/lib/vendor-utils';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BusinessDocumentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const vendorId = await getVendorIdByUserId(user.id);
  const supabase = await createClient();

  let documents: any[] = [];
  if (vendorId) {
    const { data } = await (supabase as any)
      .from('documents')
      .select('*')
      .eq('vendor_id', vendorId)
      .order('created_at', { ascending: false });
    documents = data ?? [];
  }

  return (
    <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Documents <span className="text-primary-600">Légaux</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">
                Gérez vos documents KYC et légaux
              </p>
            </div>
            <button className="bg-primary-600 text-white px-shamar-24 py-3 rounded-shamar-md font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-shamar-soft">
              Ajouter un document
            </button>
          </div>
        </div>

        {documents && documents.length > 0 ? (
          <div className="space-y-shamar-16">
            {documents.map((doc: any) => (
              <div
                key={doc.id}
                className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-24 hover:shadow-shamar-medium transition-all flex justify-between items-center"
              >
                <div>
                  <h3 className="text-shamar-h3 text-gray-900 mb-2">{doc.type}</h3>
                  <p className="text-shamar-small text-gray-500 font-medium">
                    {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`px-shamar-16 py-2 rounded-shamar-sm text-shamar-small font-medium ${
                  doc.status === 'approved'
                    ? 'bg-success-500/20 text-emerald-700'
                    : doc.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-warning-500/20 text-amber-700'
                }`}>
                  {doc.status === 'approved' ? 'Approuvé' : doc.status === 'rejected' ? 'Rejeté' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft p-shamar-48 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
            <p className="text-gray-500 font-medium text-shamar-body">Aucun document uploadé</p>
          </div>
        )}
      </div>
    </div>
  );
}
