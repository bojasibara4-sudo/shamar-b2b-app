import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function BusinessDocumentsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  
  // Récupérer les documents (si table existe)
  const { data: documents } = await (supabase as any)
    .from('documents')
    .select('*')
    .eq('seller_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Documents Légaux
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700">
            Ajouter un document
          </button>
        </div>

        {documents && documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc: any) => (
              <div
                key={doc.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{doc.type}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(doc.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-sm ${
                  doc.status === 'approved'
                    ? 'bg-emerald-100 text-emerald-700'
                    : doc.status === 'rejected'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {doc.status === 'approved' ? 'Approuvé' : doc.status === 'rejected' ? 'Rejeté' : 'En attente'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Aucun document uploadé</p>
        )}
      </div>
    </div>
  );
}
