import { getCurrentUser } from '@/lib/auth';
import { getUserDisputes } from '@/services/dispute.service';
import Link from 'next/link';
import { AlertTriangle, ChevronRight, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function DisputesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const disputes = await getUserDisputes(user.id);

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
      <div className="space-y-shamar-32 animate-in fade-in duration-500">
        <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-shamar-16">
            <div>
              <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
                Centre de <span className="text-primary-600">Litiges</span>
              </h1>
              <p className="text-shamar-body text-gray-500 font-medium">Gérez et résolvez les problèmes liés à vos commandes</p>
            </div>
            <Link
              href="/aide"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-shamar-24 py-3 rounded-shamar-md font-semibold hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              Aide & FAQ
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-shamar-16">
          {disputes.length > 0 ? (
            disputes.map((dispute: any) => (
              <Link
                key={dispute.id}
                href={`/disputes/${dispute.id}`}
                className="block bg-gray-0 p-shamar-24 rounded-shamar-md border border-gray-200 shadow-shamar-soft hover:shadow-shamar-medium hover:border-primary-600/30 transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-shamar-24">
                  <div className="flex items-start gap-shamar-16">
                    <div className="w-12 h-12 bg-warning-500/20 rounded-shamar-md flex items-center justify-center text-warning-500 flex-shrink-0">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-shamar-caption font-mono text-gray-400 font-medium">ID: {dispute.id?.slice(0, 8)}</span>
                        <span className="text-shamar-caption text-gray-400 font-medium">• Commande #{dispute.order_id?.slice(0, 8)}</span>
                      </div>
                      <h3 className="text-shamar-h3 text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">{dispute.reason}</h3>
                      <p className="text-shamar-small text-gray-500 line-clamp-1 font-medium">{dispute.description || 'Aucune description'}</p>
                      <div className="flex items-center gap-shamar-16 mt-shamar-16">
                        <span className={`px-3 py-1.5 rounded-shamar-sm text-shamar-caption font-semibold ${
                          dispute.status === 'open' ? 'bg-warning-500/20 text-gray-800' :
                          dispute.status === 'resolved' ? 'bg-success-500/20 text-gray-800' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {dispute.status === 'open' ? 'Ouvert' : dispute.status === 'resolved' ? 'Résolu' : dispute.status}
                        </span>
                        <span className="text-shamar-caption text-gray-400 font-medium">
                          Créé le {new Date(dispute.created_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="text-primary-600 font-semibold text-shamar-small flex items-center gap-1 group-hover:gap-2 transition-all">
                      Détails <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="py-shamar-80 flex flex-col items-center justify-center text-gray-400 space-y-shamar-16 bg-gray-0 rounded-shamar-md border border-gray-200 shadow-shamar-soft">
              <AlertTriangle size={48} strokeWidth={1} />
              <p className="font-medium text-shamar-body">Vous n&apos;avez aucun litige en cours.</p>
              <Link href="/aide" className="text-primary-600 font-semibold hover:underline text-shamar-small">
                En savoir plus sur la gestion des litiges
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}
