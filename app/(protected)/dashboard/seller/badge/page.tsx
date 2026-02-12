import { requireSeller } from '@/lib/auth-guard';
import Link from 'next/link';
import { getVendorByUserId } from '@/services/vendor.service';
import { getVendorBadges } from '@/services/badge.service';
import { getVendorAverageRating } from '@/services/review.service';

export const dynamic = 'force-dynamic';

const LEVEL_LABELS: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  premium: 'Diamond',
};

export default async function SellerBadgePage() {
  const user = await requireSeller();
  const vendor = await getVendorByUserId(user.id);
  const badges = vendor ? await getVendorBadges(vendor.id) : [];
  const avgRating = vendor ? await getVendorAverageRating(vendor.user_id) : 0;

  return (
    <div className="bg-gray-50 min-h-full">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 lg:px-8 py-shamar-24">
        <div className="space-y-shamar-32 animate-in fade-in duration-500">
          <div>
            <Link href="/dashboard/seller" className="text-shamar-small font-medium text-gray-500 hover:text-primary-600">
              ← Tableau de bord vendeur
            </Link>
            <h1 className="text-shamar-h1 text-gray-900 tracking-tight mt-2 mb-2">
              Mon badge
            </h1>
            <p className="text-shamar-body text-gray-500 font-medium">
              Critères, progression et conseils
            </p>
          </div>

          <div className="grid gap-shamar-24 md:grid-cols-2">
            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
              <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Badge actuel</h2>
              {vendor && (
                <>
                  <p className="text-shamar-body text-gray-600 font-medium mb-2">
                    Niveau : <span className="font-semibold text-primary-600">{LEVEL_LABELS[vendor.level] || vendor.level}</span>
                  </p>
                  <p className="text-shamar-small text-gray-500 mb-shamar-16">
                    Note moyenne vendeur : <span className="font-semibold text-gray-900">{avgRating.toFixed(1)} / 5</span>
                  </p>
                  {badges.length > 0 ? (
                    <ul className="space-y-2">
                      {badges.map((vb: any) => (
                        <li key={vb.badge_id} className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-shamar-sm bg-primary-500/10 text-primary-600 font-semibold text-shamar-small">
                            {vb.badge?.label || vb.badge_id}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-shamar-small text-gray-500">Aucun badge attribué pour l&apos;instant.</p>
                  )}
                </>
              )}
              {!vendor && (
                <p className="text-shamar-body text-gray-500">Profil vendeur non trouvé.</p>
              )}
            </div>

            <div className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-32 shadow-shamar-soft">
              <h2 className="text-shamar-h3 text-gray-900 mb-shamar-16">Critères et conseils</h2>
              <ul className="space-y-3 text-shamar-small text-gray-600">
                <li>• Complétez vos informations boutique et produits pour gagner en visibilité.</li>
                <li>• Répondez rapidement aux commandes et offres pour améliorer votre niveau.</li>
                <li>• Les avis positifs des acheteurs font monter votre note et votre badge.</li>
                <li>• Consultez la page <Link href="/badges" className="text-primary-600 font-semibold hover:underline">Badges</Link> pour voir tous les paliers (Bronze, Silver, Gold, Diamond).</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
