import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function ExecPayoutsPage() {
  return (
    <OwnerPageShell
      title="Payouts"
      description="Versements aux vendeurs."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Payouts — Vice-président / Président.</p>
      </div>
    </OwnerPageShell>
  );
}
