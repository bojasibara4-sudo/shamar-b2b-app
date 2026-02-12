import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function RootFeatureFlagsPage() {
  return (
    <OwnerPageShell
      title="Feature flags"
      description="Activation et désactivation des fonctionnalités en production."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">
          Gestion des feature flags — réservé au Président.
        </p>
      </div>
    </OwnerPageShell>
  );
}
