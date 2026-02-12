import { getCurrentUser } from '@/lib/auth';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HostReviewsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  // TODO: Récupérer avis depuis API
  const reviews: any[] = [];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">Avis reçus</h1>

      <div className="bg-brand-bleu-ardoise/50 rounded-2xl border border-brand-anthracite/50 p-12">
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((r: any) => (
              <div key={r.id} className="py-4 border-b border-brand-anthracite/30 last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <Star key={n} size={18} className={n <= (r.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-slate-600'} />
                  ))}
                  <span className="text-slate-400 text-sm ml-2">{r.guest} • {r.date}</span>
                </div>
                <p className="text-slate-300">{r.comment}</p>
                {r.host_reply && (
                  <div className="mt-3 pl-4 border-l-2 border-rose-500/30">
                    <p className="text-sm text-slate-400">Réponse : {r.host_reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Star className="h-16 w-16 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Aucun avis pour le moment</p>
            <p className="text-slate-500 text-sm mt-1">Les avis de vos voyageurs apparaîtront ici après leur séjour</p>
          </div>
        )}
      </div>
    </div>
  );
}
