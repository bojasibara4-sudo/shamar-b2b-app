import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ArrowLeft } from 'lucide-react';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Badges vendeurs',
  description: 'Découvrez les niveaux et badges des vendeurs Shamar B2B',
};

const LEVEL_ORDER = ['bronze', 'silver', 'gold', 'premium'];
const LEVEL_LABELS: Record<string, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  premium: 'Diamond',
};

export default async function BadgesPublicPage() {
  const supabase = await createClient();
  const { data: badges } = await (supabase as any)
    .from('badges')
    .select('id, code, label, description, category, level_required')
    .order('level_required', { ascending: true });

  const byLevel = (LEVEL_ORDER as string[]).reduce((acc, level) => {
    acc[level] = (badges || []).filter((b: any) => b.level_required === level);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-shamar-container mx-auto px-4 sm:px-6 py-shamar-24 lg:py-shamar-40">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-shamar-small text-gray-500 hover:text-primary-600 font-medium mb-shamar-24"
        >
          <ArrowLeft size={16} />
          Retour à l&apos;accueil
        </Link>
        <h1 className="text-shamar-h1 text-gray-900 tracking-tight mb-2">
          Badges et niveaux vendeurs
        </h1>
        <p className="text-shamar-body text-gray-500 mb-shamar-32">
          Bronze, Silver, Gold et Diamond : avantages et conditions
        </p>
        <div className="space-y-shamar-24">
          {LEVEL_ORDER.map((level) => (
            <section key={level} className="bg-gray-0 rounded-shamar-md border border-gray-200 p-shamar-24 shadow-shamar-soft">
              <h2 className="text-shamar-h2 text-gray-900 mb-shamar-16">
                {LEVEL_LABELS[level] || level}
              </h2>
              {(byLevel[level]?.length > 0) ? (
                <ul className="space-y-shamar-16">
                  {byLevel[level].map((b: any) => (
                    <li key={b.id} className="border-b border-gray-200 pb-shamar-16 last:border-0 last:pb-0">
                      <h3 className="font-semibold text-shamar-body text-gray-900">{b.label}</h3>
                      {b.description && <p className="text-gray-600 text-shamar-small mt-1">{b.description}</p>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-shamar-small">Aucun badge défini pour ce niveau.</p>
              )}
            </section>
          ))}
        </div>
        <p className="mt-shamar-32 text-center text-shamar-small text-gray-500">
          Les vendeurs progressent selon leurs ventes, avis et conformité. Consultez votre{' '}
          <Link href="/dashboard/seller/badge" className="text-primary-600 font-medium hover:underline">
            tableau de bord vendeur
          </Link>{' '}
          pour voir votre badge actuel.
        </p>
      </div>
    </div>
  );
}
