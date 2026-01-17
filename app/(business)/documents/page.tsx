import { getCurrentUser } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { FileText } from 'lucide-react';

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
                Documents <span className="text-indigo-600">Légaux</span>
              </h1>
              <p className="text-lg text-slate-500 font-medium">
                Gérez vos documents KYC et légaux
              </p>
            </div>
            <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20">
              Ajouter un document
            </button>
          </div>
        </div>

        {documents && documents.length > 0 ? (
          <div className="space-y-4">
            {documents.map((doc: any) => (
              <div
                key={doc.id}
                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 hover:shadow-xl hover:-translate-y-1 transition-all flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">{doc.type}</h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {new Date(doc.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <span className={`px-4 py-2 rounded-full text-sm font-black ${
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
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 text-center">
            <FileText className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Aucun document uploadé</p>
          </div>
        )}
      </div>
    </div>
  );
}
