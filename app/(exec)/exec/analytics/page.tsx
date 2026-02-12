import { OwnerPageShell } from '@/components/owner/OwnerPageShell';

export const dynamic = 'force-dynamic';

export default function ExecAnalyticsPage() {
  return (
    <OwnerPageShell
      title="Analytics"
      description="Tableaux de bord et indicateurs globaux."
    >
      <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm">
        <p className="text-slate-600">Analytics — Vice-président / Président.</p>
      </div>
    </OwnerPageShell>
  );
}
