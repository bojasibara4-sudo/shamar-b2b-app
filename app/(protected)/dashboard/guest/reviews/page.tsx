import { getCurrentUser } from '@/lib/auth';
import { Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function GuestReviewsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const reviews: any[] = [];

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <h1 className="text-shamar-h1 text-gray-900 tracking-tight">Avis donnés</h1>

          <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
            {reviews.length > 0 ? (
              <div className="space-y-shamar-16">
                {reviews.map((r: any) => (
                  <div key={r.id} className="py-shamar-16 border-b border-gray-200 last:border-0">
                    <p className="font-semibold text-gray-900">{r.property_title}</p>
                    <div className="flex gap-1 mt-2">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n} size={16} className={n <= (r.rating || 0) ? 'fill-primary-500 text-primary-500' : 'text-gray-300'} />
                      ))}
                    </div>
                    <p className="text-shamar-small text-gray-500 mt-1">{r.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-shamar-48">
                <Star className="h-16 w-16 text-gray-400 mx-auto mb-shamar-16" />
                <p className="text-gray-500 font-medium">Aucun avis donné</p>
                <p className="text-shamar-small text-gray-500 mt-1">Laissez un avis après vos séjours</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
