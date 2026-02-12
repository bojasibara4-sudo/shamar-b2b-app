import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function RootFinanceSystemPage() {
  return (
    <OwnerPageShell
      title="Finance système"
      description="Finance plateforme, override paiements / escrows / disputes."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">
          Vue finance système et actions de override (paiements, escrows, litiges) — Président uniquement.
        </p>
      </div>
    </OwnerPageShell>
  );
}
